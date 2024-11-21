export interface SavedPhrase { 
    conversation_index : number;
    message_index : number;
    phrase : string; 
    translation : string;
}

export interface Error { 
    Correction : string;
    Error : string;
    Phrase : string;
    message : string;
}