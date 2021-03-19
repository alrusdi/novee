export const SOLO_GAME_FIRST_STAGE_ACTIVATIONS_COUNT = 8;
export const MAX_ACTIVE_TILES = 21;

export enum GameState {
    NEW = 'new',
    ACTIVE = 'active',
    FINISHED = 'finished'
}

export enum InvitationState {
    INVITATION = 'invitation',
    CONFIRMATION = 'confirmation',
    COMPLETE = 'complete'
}
