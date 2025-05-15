// Позволява използването на основния модул без типове
declare module 'react-syntax-highlighter';

// Позволява използването на конкретен стил от ESM версиите
declare module 'react-syntax-highlighter/dist/esm/styles/prism';

// Ако използваш други стилове (напр. `atomDark`, `vscDarkPlus`, и т.н.), добави ги също:
declare module 'react-syntax-highlighter/dist/esm/styles/prism/*';
