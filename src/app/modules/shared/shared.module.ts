import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {IsLoggedInGuard} from './guards/is-logged-in.guard';
import {IntegerInputDirective} from './directives/integer-input.directive';
import {PaginationComponent} from "./components/pagination/pagination.component";

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        IntegerInputDirective,
        PaginationComponent
    ],
    providers: [
        IsLoggedInGuard
    ],
    declarations: [
        IntegerInputDirective,
        PaginationComponent
    ]
})
export class SharedModule {
}