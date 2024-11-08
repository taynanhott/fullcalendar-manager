import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, get, push, query, orderByChild, equalTo } from 'firebase/database';

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
    id: newReference.key,
    title: title,
    start: start,
    end: end,
    allDay: allDay,
    color: color,
    userId: userId
  })

  return newReference;
}

async function getEventsByUserId(userId: string): Promise<Event[]> {
  const db = getDatabase();
  const eventsRef = ref(db, "event");

  const userQuery = query(eventsRef, orderByChild("userId"), equalTo(userId));
  const snapshot = await get(userQuery);

  const events: Event[] = [];
  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot) => {
      const eventData = childSnapshot.val() as Event;
      events.push(eventData);
    });
  } else {
    console.log("Nenhum dado encontrado.");
  }

  return events;
}

async function updateEvent(eventId: string, updatedData: { id: string, title: string; start: string | Date; end: string | Date; allDay: boolean; color: string; userId: string }): Promise<void> {
  const db = getDatabase();
  const eventRef = ref(db, `event/${eventId}`);

  try {
    await set(eventRef, updatedData);
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
  }
}

async function deleteEvent(eventId: string): Promise<void> {
  const db = getDatabase();
  const eventRef = ref(db, `event/${eventId}`);

  try {
    await set(eventRef, null);
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
  }
}

export { auth, writeEventData, getEventsByUserId, deleteEvent, updateEvent };