type Event = {
    id? : number | undefined;
    title: string;
    time: string;
    date?: Date;
}

export default Event;