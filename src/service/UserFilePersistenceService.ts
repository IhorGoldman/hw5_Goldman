export interface UserFilePersistenceService {
    saveToFile():string;
    restoreDataFromFile():string;
}