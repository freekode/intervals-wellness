import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { ConfigurationService } from "infrastructure/configuration.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CanActivateWelnessFormRouteGuard implements CanActivate {
    constructor(
        private router: Router,
        private configurationService: ConfigurationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if (this.configurationService.getConfiguration().isFull()) {
            return true
        }
        this.router.navigate(['/configuration']);
        return false
    }
}