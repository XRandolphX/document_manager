// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpWOCkDcqVq65zVaE4gNgktomYdYOaWX4",
  authDomain: "generadordocs.firebaseapp.com",
  projectId: "generadordocs",
  storageBucket: "generadordocs.appspot.com",
  messagingSenderId: "131847063702",
  appId: "1:131847063702:web:f964124ad63ee0d5f99ab7",
  measurementId: "G-NP17P4SMPD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFile(file, fileExtension) {
  try {
    const storageRef = ref(storage, v4() + "." + fileExtension);
    console.log("Subiendo archivo:", file); // Verificar que el archivo se está pasando correctamente
    const uploadResult = await uploadBytes(storageRef, file);
    console.log("Archivo subido:", uploadResult); // Confirmar que el archivo se subió
    const url = await getDownloadURL(storageRef);
    console.log("URL obtenida:", url); // Verificar que obtienes la URL
    return url;
  } catch (error) {
    console.error("Error al subir el archivo:", error); // Ver el error si algo va mal
    throw error; // Re-throw the error so it can be caught by the caller
  }
}

// export async function deleteFile(filePath) {
//   try {
//     const fileRef = ref(storage, filePath);
//     await deleteObject(fileRef);
//     console.log("Archivo eliminado con éxito:", filePath);
//   } catch (error) {
//     console.error("Error al eliminar el archivo:", error);
//     throw error; // Lanzar el error para que pueda ser capturado por el llamador
//   }
// }

// export async function obtenerURLDeArchivo(nombreArchivo) {
//   try {
//     const storageRef = ref(storage, nombreArchivo);
//     const url = await getDownloadURL(storageRef);
//     console.log("URL obtenida:", url); // Verificar que obtienes la URL
//     return url;
//   } catch (error) {
//     console.error("Error al obtener la URL del archivo:", error); // Ver el error si algo va mal
//     throw error; // Re-throw the error so it can be caught by the caller
//   }
// }

// export async function buscarArchivosPorPalabrasClave(palabrasClave) {
//   try {
//     const archivosEnStorage = await listAll(ref(storage, "/")); // Obtener la lista de archivos en el almacenamiento
//     const archivosCoincidentes = [];

//     // Recorrer la lista de archivos y buscar coincidencias con las palabras clave
//     for (const archivo of archivosEnStorage.items) {
//       const nombreArchivo = archivo.name.toLowerCase(); // Convertir el nombre del archivo a minúsculas para hacer una búsqueda insensible a mayúsculas y minúsculas
//       if (
//         palabrasClave.some((palabra) =>
//           nombreArchivo.includes(palabra.toLowerCase())
//         )
//       ) {
//         archivosCoincidentes.push(archivo.name);
//       }
//     }

//     // Obtener las URLs de los archivos coincidentes
//     const urlsArchivos = await Promise.all(
//       archivosCoincidentes.map(async (nombreArchivo) => {
//         const storageRef = ref(storage, nombreArchivo);
//         return await getDownloadURL(storageRef);
//       })
//     );
//     // // Suponiendo que urlsArchivos es un array de URLs
//     // urlsArchivos.forEach((url) => {
//     //   console.log(url.substring(0, 50)); // Imprime los primeros 50 caracteres de cada URL
//     //   console.log(url.substring(50)); // Imprime el resto de cada URL
//     // });

//     return urlsArchivos;
//   } catch (error) {
//     console.error("Error al buscar archivos por palabras clave:", error);
//     throw error;
//   }
// }

export async function buscarArchivosPorPalabrasClave(palabrasClave) {
  try {
    const archivosEnStorage = await listAll(ref(storage, "/")); // Obtener la lista de archivos en el almacenamiento

    // Convertir las palabras clave a minúsculas de una vez
    const palabrasClaveMin = palabrasClave.map((palabra) =>
      palabra.toLowerCase()
    );

    const archivosCoincidentes = [];

    // Recorrer la lista de archivos y buscar coincidencias con las palabras clave
    for (const archivo of archivosEnStorage.items) {
      const nombreArchivo = archivo.name.toLowerCase(); // Convertir el nombre del archivo a minúsculas para hacer una búsqueda insensible a mayúsculas y minúsculas
      if (palabrasClaveMin.some((palabra) => nombreArchivo.includes(palabra))) {
        archivosCoincidentes.push(archivo.name);
      }
    }

    // Obtener las URLs de los archivos coincidentes utilizando Promise.allSettled
    const urlsArchivosPromises = archivosCoincidentes.map((nombreArchivo) => {
      const storageRef = ref(storage, nombreArchivo);
      return getDownloadURL(storageRef).catch((error) => {
        console.error(`Error al obtener la URL para ${nombreArchivo}:`, error);
        return null; // Manejar el error y continuar con null
      });
    });

    const urlsArchivosResults = await Promise.allSettled(urlsArchivosPromises);
    const urlsArchivos = urlsArchivosResults
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    return urlsArchivos;
  } catch (error) {
    console.error(
      "Error al buscar archivos por palabras clave BACKEND:",
      error
    );
    throw error;
  }
}
