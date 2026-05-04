
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const PERFECTPAY_SECURITY_TOKEN = "a57340234e6d72b4ceebbda5bf09f4be";

/**
 * Webhook da PerfectPay
 * Processa pagamentos e libera sites automaticamente.
 */
export async function POST(request: Request) {
  console.log('Webhook PerfectPay: Nova requisição recebida.');
  
  try {
    const contentType = request.headers.get('content-type') || '';
    let data: any = {};

    // 1. Parse robusto do corpo da requisição
    try {
      if (contentType.includes('application/json')) {
        data = await request.json();
      } else {
        const formData = await request.formData();
        data = Object.fromEntries(formData.entries());
      }
    } catch (e) {
      console.error('Erro ao processar corpo da requisição:', e);
      return NextResponse.json({ error: 'Corpo inválido' }, { status: 400 });
    }

    // 2. Validação do Token
    if (!data.token || data.token !== PERFECTPAY_SECURITY_TOKEN) {
      console.error('Webhook: Token inválido.');
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // 3. Extração do Identificador (Slug)
    // A PerfectPay envia o parâmetro 'src' que passamos na URL do checkout
    const subdomainName = 
      data.src || 
      data.reference || 
      (data.tracking_parameters?.src) ||
      (data.metadata?.src);

    if (!subdomainName) {
      console.warn('Webhook: Identificador do site (src) não encontrado.');
      return NextResponse.json({ message: 'Identificador ausente' }, { status: 200 });
    }

    const { firestore, auth } = initializeFirebase();
    const siteRef = doc(firestore, 'published_sites', subdomainName);
    
    // Verifica se o documento existe
    const siteSnap = await getDoc(siteRef);
    if (!siteSnap.exists()) {
      console.error(`Webhook: Site [${subdomainName}] não existe no Firestore.`);
      return NextResponse.json({ message: 'Site não encontrado' }, { status: 200 });
    }

    const saleStatus = Number(data.sale_status_enum);
    const emailCliente = data.customer?.email || data.customer_email || siteSnap.data().customerEmail;

    // 4. LÓGICA DE LIBERAÇÃO (2=Aprovado, 7=Faturado, 10=Completo)
    if ([2, 7, 10].includes(saleStatus)) {
      console.log(`Webhook: Liberando site ${subdomainName} para o e-mail ${emailCliente}`);

      // PRIORIDADE 1: Atualizar o documento para liberado
      await updateDoc(siteRef, {
        status: 'published',
        customerEmail: emailCliente || '',
        publishedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log(`Webhook: Site [${subdomainName}] LIBERADO no Firestore.`);

      // PRIORIDADE 2: Tentar criar conta (Opcional, não trava a liberação se falhar)
      if (emailCliente && emailCliente.includes('@')) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, emailCliente, 'Eternize123');
          const newUserId = userCredential.user.uid;
          
          // Vincula o UID do novo usuário ao site
          await updateDoc(siteRef, { userId: newUserId });
          console.log(`Webhook: Conta criada e vinculada para ${emailCliente}`);
        } catch (authError: any) {
          if (authError.code === 'auth/email-already-in-use') {
            console.log(`Webhook: Usuário ${emailCliente} já possui conta.`);
          } else {
            console.warn(`Webhook: Erro ao criar conta (ignorado para manter liberação):`, authError.message);
          }
        }
      }

      return NextResponse.json({ message: 'Sucesso: Site liberado.' });
    }

    // 5. LÓGICA DE BLOQUEIO (Cancelados, Estornados, etc)
    if ([3, 4, 6, 11].includes(saleStatus)) {
      await updateDoc(siteRef, {
        status: 'pending',
        updatedAt: serverTimestamp()
      });
      console.log(`Webhook: Site [${subdomainName}] BLOQUEADO (Pagamento cancelado/estornado).`);
      return NextResponse.json({ message: 'Sucesso: Acesso revogado.' });
    }

    return NextResponse.json({ message: `Status ${saleStatus} ignorado.` });

  } catch (error: any) {
    console.error('Webhook Fatal Error:', error);
    return NextResponse.json({ 
      error: 'Erro interno no Webhook', 
      details: error.message 
    }, { status: 500 });
  }
}
