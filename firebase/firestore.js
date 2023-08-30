import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  getDocs,
  query
} from "firebase/firestore";
import {
  firestore
} from "./firebase-setup";


export async function getTherapists() {
  try {
    let data = [];
    const collectionVideos = collection(firestore, "therapists");
    const q = query(collectionVideos);
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return data;
    }

    querySnapshot.forEach((doc) => {
      data.push({
        ...doc.data(),
        id: doc.id
      });
    });
    // console.log("data555555 = ", data)
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function getVideos() {
  try {
    let data = [];
    const collectionVideos = collection(firestore, "videos");
    const q = query(collectionVideos);
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return data;
    }
    querySnapshot.forEach((doc) => {
      console.log("doc22 = ", doc)
      data.push({
        ...doc.data(),
        id: doc.id
      });
    });
    console.log("data555 = ", data)
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function writeToVideos(data) {
  try {
    await addDoc(collection(firestore, "videos"), data);
  } catch (err) {
    console.log(err);
  }
}

export async function update(key, obj) {
  try {
    const docRef = doc(firestore, "videos", key);
    await updateDoc(docRef, obj);
  } catch (err) {
    console.log(err);
  }
}