import { Injectable } from '@angular/core';
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  private graphClient: Client;

  constructor(private authService: AuthService) {
    this.graphClient = Client.init({
      authProvider: async (done) => {
        // Get the token from the auth service
        let token = await this.authService.getAccessToken()
          .catch((reason) => {
            done(reason, null);
          });

        if (token) {
          done(null, token);
        } else {
          done("Could not get an access token", null);
        }
      }
    });

  }

  async getEvents(globalId: string): Promise<Event[]> {
    try {
      let result = await this.graphClient.api("/users?$filter=startswith(displayName,'" + globalId + "') OR startswith(userPrincipalName,'" + globalId + "')").get();
      return result.value;
    } catch (error) {
      //this.authService.refreshGraphToken();
    }
  }

}
