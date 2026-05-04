
import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from '@/firebase/config';

// Token de segurança que você configurou na PerfectPay
const PERFECTPAY_SECURITY_TOKEN = "a57340234e6d72b4ceebbda5bf09f4be";

/**
 * Inicializa o Firebase de forma segura para o ambiente de servidor (Node.js)
 * Evita o erro de "Attempted to call initializeFirebase from server"
 */
function getFirebaseServer() {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  return {
    firestore: getFirestore(app),
    auth: getAuth(app)
  };
}

/**
 * Webhook da PerfectPay
 * Processa a aprovação da venda e libera o site no banco de dados.
 */
export async function POST(request: Request) {
  console.log('--- Webhook PerfectPay Iniciado ---');
  
  try {
    const contentType = request.headers.get('content-type') || '';
    let data: any = {};

    // 1. Captura os dados independente do formato (JSON ou Form)
    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    // 2. Validação do Token de Segurança
    if (!data.token || data.token !== PERFECTPAY_SECURITY_TOKEN) {
      console.error('Webhook: Token inválido ou ausente.');
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // 3. Mapeamento dos parâmetros (baseado na sua imagem da PerfectPay)
    // Buscamos 'src' em todas as variações possíveis
    const subdomainName = 
      data.src || 
      data.tracking_parameters?.src || 
      data.reference || 
      data.reference_id;

    const customerEmail = 
      data.clienteEmail || 
      data.customer_email || 
      data.customer?.email;

    const saleStatus = Number(data.sale_status_enum || data.statusPagamento);

    console.log(`Webhook: Processando Site [${subdomainName}] | Status: ${saleStatus} | Email: ${customerEmail}`);

    if (!subdomainName) {
      console.warn('Webhook: Identificador "src" não encontrado nos dados recebidos.');
      return NextResponse.json({ message: 'Identificador src ausente' }, { status: 200 });
    }

    const { firestore, auth } = getFirebaseServer();
    const siteRef = doc(firestore, 'published_sites', subdomainName);
    
    // Verifica se o site existe no banco antes de prosseguir
    const siteSnap = await getDoc(siteRef);
    if (!siteSnap.exists()) {
      console.error(`Webhook: O site "${subdomainName}" não foi encontrado no Firestore.`);
      return NextResponse.json({ message: 'Site não encontrado' }, { status: 200 });
    }

    // 4. LÓGICA DE LIBERAÇÃO (2=Aprovado, 7=Faturado, 10=Completo)
    if ([2, 7, 10].includes(saleStatus)) {
      console.log(`Webhook: LIBERANDO ACESSO para ${subdomainName}`);

      // ATUALIZAÇÃO DO STATUS (Prioridade Máxima)
      await updateDoc(siteRef, {
        status: 'published',
        customerEmail: customerEmail || siteSnap.data().customerEmail || '',
        publishedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('Webhook: Status atualizado para "published" com sucesso.');

      // CRIAÇÃO DE CONTA (Processo Secundário)
      if (customerEmail && customerEmail.includes('@')) {
        try {
          // Tentamos criar a conta com a senha padrão
          const userCredential = await createUserWithEmailAndPassword(auth, customerEmail, 'Eternize123');
          const newUserId = userCredential.user.uid;
          
          // Vincula o site ao novo UID para aparecer no painel do cliente
          await updateDoc(siteRef, { userId: newUserId });
          console.log(`Webhook: Conta criada e vinculada para ${customerEmail}`);
        } catch (authError: any) {
          // Se o e-mail já existe, apenas ignoramos o erro e o cliente loga com a conta dele
          if (authError.code === 'auth/email-already-in-use') {
            console.log(`Webhook: O cliente ${customerEmail} já possui conta no sistema.`);
          } else {
            console.warn('Webhook: Falha ao criar conta (ignorada para não travar a liberação):', authError.message);
          }
        }
      }

      return NextResponse.json({ message: 'Sucesso: Site liberado.' });
    }

    // 5. LÓGICA DE BLOQUEIO (3=Cancelado, 4=Chargeback, 6=Devolvido)
    if ([3, 4, 6, 11].includes(saleStatus)) {
      await updateDoc(siteRef, {
        status: 'pending',
        updatedAt: serverTimestamp()
      });
      console.log(`Webhook: Site [${subdomainName}] bloqueado devido ao status do pagamento.`);
      return NextResponse.json({ message: 'Sucesso: Acesso revogado.' });
    }

    return NextResponse.json({ message: `Status ${saleStatus} processado sem alterações.` });

  } catch (error: any) {
    console.error('Webhook: ERRO FATAL:', error.message);
    return NextResponse.json({ 
      error: 'Erro interno no servidor', 
      details: error.message 
    }, { status: 500 });
  }
}
