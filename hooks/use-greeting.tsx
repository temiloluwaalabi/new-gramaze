// utils/greetings.ts
export function getGreeting(name: string) {
  // name is now required
  const currentHour = new Date().getHours();

  let greeting = "";

  if (currentHour >= 0 && currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour >= 12 && currentHour < 16) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  // Return with bolded name (using JSX if in a React component)
  return (
    <span>
      {greeting}, <strong>{name}</strong>
    </span>
  );

  //  If not using JSX, you can just return the string (no bolding without markup)
  // return `${greeting}, ${name}`;
}
