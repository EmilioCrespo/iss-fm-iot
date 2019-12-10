import { Component, OnInit } from '@angular/core';
declare var jQuery: any;

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {

  collapsed: boolean = false;
  /**
   * Show and hidde the lateral menu
   */
  displayMenu() {
    (function ($) {
      $(document).ready(function () {
        $('#sidebar').toggleClass('active');
        $('#sidebarCollapse').toggleClass('active');
      });
    })(jQuery);
  }

  changeSideMenu(){
    this.collapsed = !this.collapsed;
  }

}
