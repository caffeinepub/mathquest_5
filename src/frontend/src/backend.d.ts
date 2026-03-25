import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface ScoreEntryInput {
    difficulty: string;
    score: bigint;
    playerName: string;
    ageGroup: string;
}
export interface ScoreEntry {
    difficulty: string;
    score: bigint;
    timestamp: Time;
    playerName: string;
    ageGroup: string;
}
export interface backendInterface {
    getGlobalTop10(): Promise<Array<ScoreEntry>>;
    getTop10ByAgeGroup(ageGroup: string): Promise<Array<ScoreEntry>>;
    submitScore(input: ScoreEntryInput): Promise<void>;
}
