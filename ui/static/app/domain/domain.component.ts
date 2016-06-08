import { Component, OnInit } from "@angular/core";
import { CanActivate, Router, RouteParams } from "@angular/router-deprecated";
import { URLSearchParams } from "@angular/http";
import { DomainService } from "./domain.service";
import { Domain } from "./domain";
import { isLoggedin }  from "../auth/auth.service";
import { PaginationComponent } from "../pagination/pagination.component";
import "rxjs/add/observable/throw";


@Component({
  templateUrl: "/static/app/templates/domain.component.html",
  providers: [DomainService],
  directives: [PaginationComponent]
})
@CanActivate(() => isLoggedin())
export class DomainComponent implements OnInit {

  domains: Domain[];
  errorMessage: string;
  currentOffset: number = 0;
  perPage: number = 20;
  totalCount: number;
  searchValue: string;
  additionalRouteParams: {[key: string]: string} = {
    "search": null
  };
  timer: any;

  constructor(
    private domainService: DomainService,
    private router: Router,
    private routeParams: RouteParams
  ) { }

  ngOnInit() {
    let url_offset: string = this.routeParams.get("offset");
    this.currentOffset = url_offset ? Number(url_offset) : 0;
    this.searchValue = this.routeParams.get("search");
    this.getDomains();
  }

  getDomains() {
    let params: URLSearchParams = new URLSearchParams();
    params.set("limit", String(this.perPage));
    params.set("offset",  String(this.currentOffset));
    this.additionalRouteParams["search"] = this.searchValue;

    if (this.searchValue) {
      params.set("search", this.searchValue);
    }

    this.domainService.getDomains(params).map(
     (response) => response.json()
    ).subscribe(
      (json) => {
        this.totalCount = json.count;
        this.domains = json.results;
      },
      error => this.errorMessage = <any>error
    );
  }

  search(value: string) {
    this.currentOffset = 0;
    if (value.length > 1) {
      this.searchValue = value;
      this.getDomains();
    } else {
      this.searchValue = null;
      this.getDomains();
    }
  }

  onKeyUpSearch(event: KeyboardEvent, value: string) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => this.search(value), 300);
  }
}
