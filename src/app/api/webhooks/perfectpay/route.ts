
import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from '@/firebase/config';

const PERFECTPAY_SECURITY_TOKEN = "a57340234e6d72b4ceebbda5bf09f4be";

function getFirebaseServer() {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  return {
    firestore: getFirestore(app),
    auth: getAuth(app)
  };
}

export async function POST(request: Request) {
  console.log('--- Webhook PerfectPay Iniciado ---');
  
  try {
    const contentType = request.headers.get('content-type') || '';
    let data: any = {};

    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    // Validação de Token
    if (!data.token || data.token !== PERFECTPAY_SECURITY_TOKEN) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Extração robusta do ID do site (src)
    const subdomainName = 
      data.src || 
      data.tracking_parameters?.src || 
      data.reference || 
      data.reference_id || 
      data.metadata?.src;

    const customerEmail = 
      data.clienteEmail || 
      data.customer_email || 
      data.customer?.email ||
      data.email;

    // A PerfectPay envia status como string ou número. Normalizamos aqui.
    const rawStatus = data.sale_status_enum || data.statusPagamento || data.status;
    const saleStatus = Number(rawStatus);

    if (!subdomainName) {
      return NextResponse.json({ message: 'Identificador src não encontrado nos dados recebidos.', received_keys: Object.keys(data) }, { status: 200 });
    }

    const { firestore, auth } = getFirebaseServer();
    const siteRef = doc(firestore, 'published_sites', subdomainName);
    
    const siteSnap = await getDoc(siteRef);
    if (!siteSnap.exists()) {
      return NextResponse.json({ message: `O site "${subdomainName}" não existe no banco de dados.` }, { status: 200 });
    }

    // LÓGICA DE LIBERAÇÃO
    // Status comuns de aprovação: 2 (Aprovado), 7 (Faturado), 10 (Completo)
    const approvedStatuses = [2, 7, 10];
    
    if (approvedStatuses.includes(saleStatus)) {
      // 1. Liberação imediata no Banco
      await updateDoc(siteRef, {
        status: 'published',
        customerEmail: customerEmail || siteSnap.data().customerEmail || '',
        publishedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // 2. Tentativa de criação de conta (Opcional, não trava o processo)
      let accountStatus = "Não solicitada";
      if (customerEmail && customerEmail.includes('@')) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, customerEmail, 'Eternize123');
          await updateDoc(siteRef, { userId: userCredential.user.uid });
          accountStatus = "Criada com sucesso";
        } catch (authError: any) {
          accountStatus = authError.code === 'auth/email-already-in-use' ? "Já existia" : `Erro: ${authError.message}`;
        }
      }

      return NextResponse.json({ 
        message: `Sucesso: Site [${subdomainName}] liberado.`,
        status_received: saleStatus,
        account: accountStatus
      });
    }

    // Bloqueio por cancelamento/reembolso
    const blockStatuses = [3, 4, 6, 11];
    if (blockStatuses.includes(saleStatus)) {
      await updateDoc(siteRef, { status: 'pending', updatedAt: serverTimestamp() });
      return NextResponse.json({ message: `Site [${subdomainName}] bloqueado (Status ${saleStatus}).` });
    }

    // Caso receba um status de "Aguardando Pagamento" (1) ou outro
    return NextResponse.json({ 
      message: `Status ${saleStatus} recebido para o site [${subdomainName}]. Nenhuma alteração necessária ainda.`,
      tip: "Aguardando status de aprovação (2 ou 7)."
    });

  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    return NextResponse.json({ error: 'Erro interno', details: error.message }, { status: 500 });
  }
}
