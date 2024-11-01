import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, get, push } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATA_BASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function writeEventData(title: string, start: string | Date, end: string | Date, allDay: boolean, color: string, userId: string) {
  const db = getDatabase();
  const reference = ref(db, 'event/');
  const newReference = push(reference);

  set(newReference, {
    title: title,
    start: start,
    end: end,
    allDay: allDay,
    color: color,
    userId: userId
  })

  return newReference;
}

async function getEventsByUserId(userId: string) {
  const db = getDatabase();
  const eventsRef = ref(db, `events/${userId}`);

  try {
    const snapshot = await get(eventsRef);
    if (snapshot.exists()) {
      console.log('Dados retornados:', snapshot.val());
      return snapshot.val();
    } else {
      console.log('Nenhum dado encontrado para o userId:', userId);
      return {};
    }
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return {};
  }
}

export { auth, writeEventData, getEventsByUserId };