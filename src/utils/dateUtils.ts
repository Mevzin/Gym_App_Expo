
export function getDayOfWeek(): string {
    const days = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const date = new Date();
    const dayIndex = date.getDay();

    return days[dayIndex];
}

export function formatCurrentDate(): string {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();

    const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const monthName = months[month];

    return `${dayOfWeek}, ${day} de ${monthName}`;
}