
import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from '@/firebase/config';

const PERFECTPAY_SECURITY_TOKEN = "a57340234e6d72b4ceebbda5bf09f4be";

/**
 * Inicializa o Firebase de forma segura para o servidor
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
 * Processa pagamentos e libera sites automaticamente.
 */
export async function POST(request: Request) {
  console.log('Webhook PerfectPay: Processando requisição...');
  
  try {
    const contentType = request.headers.get('content-type') || '';
    let data: any = {};

    // 1. Parse do corpo da requisição
    try {
      if (contentType.includes('application/json')) {
        data = await request.json();
      } else {
        const formData = await request.formData();
        data = Object.fromEntries(formData.entries());
      }
    } catch (e) {
      console.error('Erro ao processar corpo:', e);
      return NextResponse.json({ error: 'Corpo inválido' }, { status: 400 });
    }

    // 2. Validação do Token (Obrigatório por segurança)
    if (!data.token || data.token !== PERFECTPAY_SECURITY_TOKEN) {
      console.error('Webhook: Token de segurança inválido.');
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // 3. Extração do Identificador do Site (SRC)
    // Procuramos em múltiplos lugares para garantir que o ID não se perca
    const subdomainName = 
      data.src || 
      data.reference || 
      data.reference_id ||
      data.tracking_parameters?.src ||
      data.metadata?.src;

    if (!subdomainName) {
      console.warn('Webhook: SRC (Slug do site) não encontrado nos dados.');
      return NextResponse.json({ message: 'Identificador ausente' }, { status: 200 });
    }

    const { firestore, auth } = getFirebaseServer();
    const siteRef = doc(firestore, 'published_sites', subdomainName);
    
    // Verifica se o documento existe antes de tentar atualizar
    const siteSnap = await getDoc(siteRef);
    if (!siteSnap.exists()) {
      console.error(`Webhook: Site [${subdomainName}] não encontrado no Firestore.`);
      return NextResponse.json({ message: 'Site não encontrado' }, { status: 200 });
    }

    const saleStatus = Number(data.sale_status_enum);
    const customerEmail = data.customer?.email || data.customer_email || siteSnap.data().customerEmail;

    // 4. LÓGICA DE LIBERAÇÃO (2=Aprovado, 7=Faturado, 10=Completo)
    if ([2, 7, 10].includes(saleStatus)) {
      console.log(`Webhook: Liberando site ${subdomainName} para ${customerEmail}`);

      // ATUALIZAÇÃO DO STATUS (Prioridade Máxima)
      await updateDoc(siteRef, {
        status: 'published',
        customerEmail: customerEmail || siteSnap.data().customerEmail || '',
        publishedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log(`Webhook: Site [${subdomainName}] LIBERADO.`);

      // CRIAÇÃO DE CONTA (Processo Secundário)
      if (customerEmail && customerEmail.includes('@')) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, customerEmail, 'Eternize123');
          const newUserId = userCredential.user.uid;
          
          // Vincula o site ao novo UID para aparecer no painel
          await updateDoc(siteRef, { userId: newUserId });
          console.log(`Webhook: Conta criada/vinculada para ${customerEmail}`);
        } catch (authError: any) {
          // Se o erro for 'e-mail já existe', está tudo bem, apenas não criamos uma nova
          if (authError.code === 'auth/email-already-in-use') {
            console.log(`Webhook: Usuário ${customerEmail} já possui conta.`);
          } else {
            console.warn(`Webhook: Falha ao criar conta (ignorada):`, authError.message);
          }
        }
      }

      return NextResponse.json({ message: 'Sucesso: Site liberado.' });
    }

    // 5. LÓGICA DE BLOQUEIO (Cancelado, Estornado, etc)
    if ([3, 4, 6, 11].includes(saleStatus)) {
      await updateDoc(siteRef, {
        status: 'pending',
        updatedAt: serverTimestamp()
      });
      console.log(`Webhook: Site [${subdomainName}] bloqueado por status de pagamento.`);
      return NextResponse.json({ message: 'Sucesso: Acesso revogado.' });
    }

    return NextResponse.json({ message: `Status ${saleStatus} recebido e ignorado.` });

  } catch (error: any) {
    console.error('Webhook Fatal Error:', error.message);
    return NextResponse.json({ 
      error: 'Erro interno', 
      details: error.message 
    }, { status: 500 });
  }
}
