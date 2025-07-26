import {UserService} from "./UserService.ts";
import {User} from "../model/userTypes.ts";
import {UserFilePersistenceService} from "./UserFilePersistenceService.ts";
import fs from "node:fs";
import {myLogger} from "../utils/logger.ts";


export class UserServiceEmbeddedImpl implements UserService, UserFilePersistenceService {


    private users: User[] = [];
    private rs = fs.createReadStream("src/data.txt", {encoding: "utf-8", highWaterMark: 24});

    addUser(user: User): boolean {
        if (this.users.findIndex((u: User) => u.id === user.id) === -1) {
            this.users.push(user);
            myLogger.log(`User: ${user} was added`);
            myLogger.save(`User: ${user} was added`);

            return true;
        }
        return false;
    }

    getAllUsers(): User[] {
        return [...this.users];
    }

    getUserById(id: number): User {
        const user = this.users.find(item => item.id === id);
        if (!user) throw "404";
        return user;
    }

    removeUser(id: number): User {
        const index = this.users.findIndex(item => item.id === id);
        if (index === -1) throw "404";
        const removed = this.users[index];
        this.users.splice(index, 1);
        myLogger.log(`User with id:${id} was removed`);
        myLogger.save(`User with id:${id} was removed`);

        return removed;
    }

    updateUser(newUser: User): void {
        const index = this.users.findIndex(item => item.id === newUser.id);
        if (index === -1) throw "404";
        this.users[index] = newUser;
        myLogger.log(`Data was updated, new data: ${newUser}`);
        myLogger.save(`Data was updated, new data: ${newUser}`);

    }


    restoreDataFromFile(): string {
        let result = "";
        this.rs.on('data', (chunk) => {
            if (chunk) {
                result += chunk.toString();
            } else {
                result = "[]";
            }
        })
        this.rs.on('end', () => {
            if (result) {
                this.users = JSON.parse(result);
                myLogger.log("Data was restored from file");
                myLogger.save("Data was restored from file");
                this.rs.close();
            } else {
                this.users = [{id: 123, userName: "Doron"}]
            }
        })
        this.rs.on('error', () => {
            this.users = [{id: 2, userName: "Bender"}]
            myLogger.log("Data was not restored from file");
            myLogger.save("Data was not restored from file");
        })
        return "Ok";
    }

    // @ts-ignore
    saveToFile = (): Promise<void> => new Promise((resolve, reject) => {
        const ws = fs.createWriteStream("src/data.txt", {flags: 'w'});
        const data = JSON.stringify(this.users, null, 2);

        ws.write(data);
        ws.end();

        ws.on('finish', () => {
            myLogger.log("Data was saved to file");
            myLogger.save("Data was saved to file");
            resolve();
        });
        ws.on('error', (err) => {
            myLogger.log("Error: Data was not saved to file");
            myLogger.save("Data was not saved to file");
            reject(err);
        })
    });
}