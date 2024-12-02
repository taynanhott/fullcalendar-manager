
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, push, query, orderByChild, equalTo } from 'firebase/database';

import moment from "moment";

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

type Event = {
  id: string;
  userId: string;
  title: string;
  allDay: boolean;
  finish: boolean;
  color: string;
  start: string;
  end: string;
};

function writeEventData(title: string, start: string | Date, end: string | Date, allDay: boolean, finish: boolean = false, color: string, userId: string) {
  const db = getDatabase();
  const reference = ref(db, 'event/');
  const newReference = push(reference);

  const colorCode = allDay ? color : (finish ? '#3ad737' : '#e63333');

  set(newReference, {
    id: newReference.key,
    title: title,
    start: start,
    end: end,
    allDay: allDay,
    finish: finish,
    color: colorCode,
    userId: userId
  })

  return newReference;
}

async function getEventsByUserId(userId: string, startDate: string, endDate: string): Promise<Event[]> {
  const db = getDatabase();
  const eventsRef = ref(db, "event");

  const userQuery = query(eventsRef, orderByChild("userId"), equalTo(userId));
  const snapshot = await get(userQuery);

  const events: Event[] = [];
  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot) => {
      const eventData = childSnapshot.val() as Event;

      const eventStart = moment(eventData.start);
      const eventEnd = moment(eventData.end);
      const startMoment = moment(startDate);
      const endMoment = moment(endDate);

      if ((eventStart.isBetween(startMoment, endMoment, 'day', '[]')) || (eventEnd.isBetween(startMoment, endMoment, 'day', '[]'))) {
        events.push(eventData);
      }
    });
  } else {
    console.log("Nenhum dado encontrado.");
  }

  return events;
}

async function updateEvent(eventId: string, updatedData: { id: string, title: string; start: string | Date; end: string | Date; allDay: boolean, finish: boolean; color: string; userId: string }): Promise<void> {
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
