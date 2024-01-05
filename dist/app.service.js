"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const ioredis_2 = require("@nestjs-modules/ioredis");
const app_gateway_1 = require("./app.gateway");
const app_events_1 = require("./app.events");
let AppService = class AppService {
    constructor(redisClient, appGateway) {
        this.redisClient = redisClient;
        this.appGateway = appGateway;
        app_events_1.appEvents.on('user-state-update', (updatedData) => {
            this.updateLocation(updatedData);
        });
    }
    getHello() {
        return 'Hello World!';
    }
    async updateLocation(user) {
        try {
            this.deleteDisconnectUser();
            const userJson = JSON.stringify(user);
            if (user.connect) {
                await this.redisClient.set(user.id, userJson);
                console.log('User State updated successfully : ', user.id);
            }
            else {
                try {
                    const result = await this.redisClient.del(user.id);
                    if (result === 1) {
                        console.log(`Key '${user.id}' successfully deleted.`);
                    }
                    else {
                        console.log(`Key '${user.id}' does not exist.`);
                    }
                }
                catch (error) {
                    console.error('Error deleting key:', error);
                }
            }
            return true;
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }
    async fetchAllUsersFromRedis() {
        const keys = await this.redisClient.keys('*');
        const users = [];
        for (const key of keys) {
            const userJson = await this.redisClient.get(key);
            if (userJson) {
                users.push(JSON.parse(userJson));
            }
        }
        return users;
    }
    async deleteDisconnectUser() {
        try {
            const keys = await this.redisClient.keys('*');
            for (const key of keys) {
                const value = await this.redisClient.get(key);
                if (value) {
                    const data = JSON.parse(value);
                    if (!data['connect']) {
                        await this.redisClient.del(key);
                        console.log(`Deleted key: ${key}`);
                    }
                }
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, ioredis_2.InjectRedis)()),
    __metadata("design:paramtypes", [ioredis_1.Redis,
        app_gateway_1.AppGateway])
], AppService);
//# sourceMappingURL=app.service.js.map