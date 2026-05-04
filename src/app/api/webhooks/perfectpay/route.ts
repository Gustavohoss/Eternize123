
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
  console.log('Webhook PerfectPay: Recebendo nova notificação...');
  
  try {
    const contentType = request.headers.get('content-type') || '';
    let data: any = {};

    // 1. Parse do corpo da requisição dependendo do formato enviado
    try {
      if (contentType.includes('application/json')) {
        data = await request.json();
      } else {
        const formData = await request.formData();
        data = Object.fromEntries(formData.entries());
      }
    } catch (parseError) {
      console.error('Erro ao ler corpo da requisição:', parseError);
      return NextResponse.json({ error: 'Formato de corpo inválido' }, { status: 400 });
    }

    console.log('Dados recebidos do Webhook:', JSON.stringify(data, null, 2));

    const { token, sale_status_enum, customer, customer_email } = data;
    
    // 2. Validação de segurança (Token)
    if (!token || token !== PERFECTPAY_SECURITY_TOKEN) {
      console.error('Webhook: Token de segurança inválido ou ausente.');
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // 3. Extração do Identificador do Site (Slug) de múltiplos lugares possíveis
    const subdomainName = 
      data.src || 
      (data.tracking_parameters && typeof data.tracking_parameters === 'object' ? data.tracking_parameters.src : null) ||
      (data.metadata && typeof data.metadata === 'object' ? data.metadata.src : null) ||
      data.reference;

    if (!subdomainName) {
      console.warn('Webhook: Identificador do site (src) não encontrado nos dados.');
      return NextResponse.json({ message: 'Parâmetro src não encontrado' }, { status: 200 });
    }

    const { firestore, auth } = initializeFirebase();
    const siteRef = doc(firestore, 'published_sites', subdomainName);
    
    // Verifica se o site existe no banco de dados antes de continuar
    const siteSnap = await getDoc(siteRef);
    if (!siteSnap.exists()) {
      console.error(`Webhook: Site [${subdomainName}] não encontrado no Firestore.`);
      return NextResponse.json({ message: 'Documento não encontrado no Firestore' }, { status: 200 });
    }

    const status = Number(sale_status_enum);
    const emailCliente = customer?.email || customer_email || siteSnap.data().customerEmail;

    console.log(`Webhook: Processando status ${status} para o site ${subdomainName} (Email: ${emailCliente})`);

    // 4. LÓGICA DE LIBERAÇÃO (Status 2=Aprovado, 7=Faturado, 10=Completo)
    if ([2, 7, 10].includes(status)) {
      console.log(`Webhook: Iniciando liberação...`);
      
      let finalUserId = siteSnap.data().userId;

      // Tenta criar a conta do usuário (se o e-mail for válido)
      if (emailCliente && typeof emailCliente === 'string' && emailCliente.includes('@')) {
        try {
          // Criar conta no Auth para o cliente
          const userCredential = await createUserWithEmailAndPassword(auth, emailCliente, 'Eternize123');
          finalUserId = userCredential.user.uid;
          console.log(`Webhook: Conta criada para ${emailCliente}`);
        } catch (authError: any) {
          // Se o usuário já existe, não tem problema, apenas logamos
          if (authError.code === 'auth/email-already-in-use') {
            console.log(`Webhook: Usuário já possui conta (${emailCliente})`);
          } else {
            console.warn(`Webhook: Erro ao tentar criar conta (ignorado para não travar liberação):`, authError.message);
          }
        }
      }

      // Atualiza o documento no Firestore para "publicado"
      try {
        await updateDoc(siteRef, {
          status: 'published',
          userId: finalUserId || siteSnap.data().userId,
          customerEmail: emailCliente || siteSnap.data().customerEmail || '',
          publishedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log(`Webhook: Site [${subdomainName}] LIBERADO com sucesso!`);
      } catch (dbError: any) {
        console.error('Erro ao atualizar documento no Firestore:', dbError);
        throw new Error(`Falha no banco de dados: ${dbError.message}`);
      }

      return NextResponse.json({ message: 'Site liberado com sucesso.' });
    }

    // 5. LÓGICA DE BLOQUEIO (Status 3=Cancelado, 4=Devolvido, 6=Chargeback, 11=Estornado)
    if ([3, 4, 6, 11].includes(status)) {
      await updateDoc(siteRef, {
        status: 'pending',
        updatedAt: serverTimestamp()
      });
      console.log(`Webhook: Site [${subdomainName}] BLOQUEADO por status de pagamento.`);
      return NextResponse.json({ message: 'Acesso revogado.' });
    }

    return NextResponse.json({ message: `Evento status ${status} recebido e ignorado.` });

  } catch (error: any) {
    console.error('Webhook Fatal Error:', error);
    // Retornamos o erro no JSON para você conseguir ver o que aconteceu no painel da PerfectPay
    return NextResponse.json({ 
      error: 'Erro interno ao processar webhook', 
      details: error.message 
    }, { status: 500 });
  }
}
