
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

    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    console.log('Webhook Body:', JSON.stringify(data, null, 2));

    const { token, sale_status_enum, customer, customer_email } = data;
    
    // 1. Validação de segurança
    if (token !== PERFECTPAY_SECURITY_TOKEN) {
      console.error('Webhook: Token de segurança inválido.');
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // 2. Extração do Identificador do Site (Slug)
    // Procuramos em todos os lugares onde a PerfectPay pode injetar o parâmetro 'src'
    const subdomainName = 
      data.src || 
      data.tracking_parameters?.src || 
      data.metadata?.src || 
      data.subscription?.src ||
      data.request_params?.src ||
      data.reference;

    if (!subdomainName) {
      console.warn('Webhook: Identificador "src" não encontrado nos dados recebidos.');
      return NextResponse.json({ message: 'Identificador do site não encontrado.' }, { status: 200 });
    }

    const { firestore, auth } = initializeFirebase();
    const siteRef = doc(firestore, 'published_sites', subdomainName);
    
    const siteSnap = await getDoc(siteRef);
    if (!siteSnap.exists()) {
      console.error(`Webhook: Site [${subdomainName}] não encontrado no Firestore.`);
      return NextResponse.json({ message: 'Documento não encontrado no banco.' }, { status: 200 });
    }

    const status = Number(sale_status_enum);
    const emailCliente = customer?.email || customer_email || siteSnap.data().customerEmail;

    // 3. LÓGICA DE LIBERAÇÃO (Status 2=Aprovado, 7=Faturado, 10=Completo)
    if ([2, 7, 10].includes(status)) {
      console.log(`Webhook: Iniciando liberação para o site: ${subdomainName}`);
      
      let finalUserId = siteSnap.data().userId;

      // Tenta criar a conta do usuário (se o e-mail estiver disponível e não for uma conta anônima fixa)
      if (emailCliente && emailCliente.includes('@')) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, emailCliente, 'Eternize123');
          finalUserId = userCredential.user.uid;
          console.log(`Webhook: Conta criada/vinculada para ${emailCliente}`);
        } catch (authError: any) {
          // Erro silenciado: se o usuário já existir ou falhar, apenas mantemos o processo de liberação do site
          console.log(`Webhook: Login/Auth pulado ou usuário já existe (${emailCliente})`);
        }
      }

      // Atualiza o documento para PUBLICADO
      await updateDoc(siteRef, {
        status: 'published',
        userId: finalUserId || siteSnap.data().userId,
        customerEmail: emailCliente || '',
        publishedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log(`Webhook: Site [${subdomainName}] LIBERADO com sucesso!`);
      return NextResponse.json({ message: 'Site liberado.' });
    }

    // 4. LÓGICA DE BLOQUEIO (Status 3=Cancelado, 4=Devolvido, 6=Chargeback, 11=Estornado)
    if ([3, 4, 6, 11].includes(status)) {
      await updateDoc(siteRef, {
        status: 'pending',
        updatedAt: serverTimestamp()
      });
      console.log(`Webhook: Site [${subdomainName}] BLOQUEADO (Status: ${status}).`);
      return NextResponse.json({ message: 'Acesso revogado.' });
    }

    return NextResponse.json({ message: `Evento status ${status} recebido e processado.` });

  } catch (error: any) {
    console.error('Webhook Fatal Error:', error);
    return NextResponse.json({ error: 'Erro interno', details: error.message }, { status: 500 });
  }
}
