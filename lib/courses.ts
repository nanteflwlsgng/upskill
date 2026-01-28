// lib/courses.ts

export type Step = {
    id: number;
    title: string;
    instruction: string;
    initialCode: string;
    // Le prompt caché que l'IA utilisera pour corriger l'élève
    validationCriteria: string; 
  };
  
  export const COURSE_CONTENT: Step[] = [
    {
      id: 1,
      title: "Introduction aux Server Actions",
      instruction: "Crée une fonction asynchrone nommée `submitData` qui prend `formData` en argument. Pour l'instant, fais juste un console.log dedans.",
      initialCode: `export default function Page() {
    return (
      <form>
        <button type="submit">Envoyer</button>
      </form>
    );
  }`,
      validationCriteria: "Le code doit contenir une fonction nommée 'submitData'. Elle doit être 'async'. Elle ne doit PAS encore avoir 'use server'.",
    },
    {
      id: 2,
      title: "La directive 'use server'",
      instruction: "Transforme cette fonction en Server Action. Ajoute la directive 'use server' tout en haut de la fonction.",
      initialCode: `export default function Page() {
    async function submitData(formData) {
      console.log("Envoi...");
    }
  
    return (
      <form action={submitData}>
        <button type="submit">Envoyer</button>
      </form>
    );
  }`,
      validationCriteria: "La fonction 'submitData' doit contenir la string 'use server' (avec quotes simples ou doubles) au tout début.",
    }
  ];