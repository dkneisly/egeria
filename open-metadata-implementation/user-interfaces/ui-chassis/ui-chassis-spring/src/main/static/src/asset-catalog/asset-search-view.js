/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-styles/paper-styles.js';
import '@polymer/paper-input/paper-input-behavior.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-button/vaadin-button.js';
import '@vaadin/vaadin-select/vaadin-select';
import 'multiselect-combo-box/multiselect-combo-box.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-behavior/paper-dialog-behavior.js';

import {AppLocalizeBehavior} from "@polymer/app-localize-behavior/app-localize-behavior.js";
import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '../shared-styles.js';
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";


class AssetSearchView extends mixinBehaviors([AppLocalizeBehavior], PolymerElement) {
    static get template() {
        return html`
        <custom-style>
          <style is="custom-style">
            
            paper-input.custom {
              --paper-input-container-input: {
                padding-left: 8px;
              };
              --paper-input-container-label: {
                padding: 0 8px;
                
              };
              --paper-input-container-input-invalid: {
                background: rgba(255, 0, 0, 0.2);
                width: 95%;
              }
              
            }
          </style>
        </custom-style>
            
            
      <style include="shared-styles">
        :host {
          display: flex;
          flex-flow: column;
          min-height: var(--egeria-view-min-height);
          
        }
        .multi-combo {
            min-width: 350px;
        }
        #search { 
          --iron-icon-fill-color: white;
        }
        vaadin-grid {
          flex-grow: 1;
        }
        
      </style>

      <token-ajax id="tokenAjax" last-response="{{searchResp}}"></token-ajax>
      <token-ajax id="tokenAjaxTypes" last-response="{{items}}"></token-ajax>
      
      
      <iron-form id="searchForm">
        <form method="get">
            <iron-a11y-keys keys="enter" on-keys-pressed="_search"></iron-a11y-keys>
            <div>
                <div style="display: inline-block; vertical-align: top"> 
                     <div style="width: 200pt; display: inline-block;">
                        <paper-input class="custom" id="searchField" 
                            label="Search" value="{{q}}" 
                            no-label-float 
                            required
                            minlength="2"
                            
                            autofocus>
                            <iron-icon icon="search" slot="prefix" class="icon" style="background: transparent"></iron-icon>
                        </paper-input>
                    </div>
                
                    <vaadin-button id="searchSubmit" theme="primary" on-tap="_search">
                        <iron-icon id="search" icon="search"></iron-icon>
                    </vaadin-button>
                </div>
                 
                <multiselect-combo-box class="multi-combo" id="combo" items="[[items]]" 
                    item-label-path="name" 
                    ordered="false"
                    placeholder="Open Metadata Type (required)"
                    required
                    error-message="Please select one">
                </multiselect-combo-box>
                
            </div>
        </form>
      </iron-form>
      <vaadin-grid id="grid" items="[[searchResp]]" theme="row-stripes"
                     column-reordering-allowed multi-sort>
            <vaadin-grid-column width="5em" resizable>
                <template class="header">
                    <vaadin-grid-sorter path="properties.displayName">Name</vaadin-grid-sorter>
                </template>
                <template>
                   <a href="#/asset-catalog/view/[[item.guid]]">
                        [[_itemName(item)]]
                   </a>
                </template>
            </vaadin-grid-column>
               
             <vaadin-grid-column width="5em" resizable>
                <template class="header">
                    <vaadin-grid-sorter path="type.name">Type</vaadin-grid-sorter>
                </template>
                <template>[[item.type.name]]</template>
            </vaadin-grid-column>
            
             
            <vaadin-grid-column width="15em" resizable>
                <template class="header">
                    <vaadin-grid-sorter path="properties.summary">Description</vaadin-grid-sorter>
                </template>
                <template>[[item.properties.summary]]</template>
            </vaadin-grid-column>
            
            <vaadin-grid-column width="15em" resizable>
                <template class="header">
                    <vaadin-grid-sorter path="properties.qualifiedName">QualifiedName</vaadin-grid-sorter>
                </template>
                <template>[[item.properties.qualifiedName]]</template>
            </vaadin-grid-column>
        </vaadin-grid>
      <div style="display: flex">
        <div style="display: inline-block">
          <vaadin-select id="pageSizeSelect" value="10" style="width: 5em">
              <template>
                <vaadin-list-box>
                  <vaadin-item>10</vaadin-item>
                  <vaadin-item>20</vaadin-item>
                  <vaadin-item>50</vaadin-item>
                  <vaadin-item>100</vaadin-item>
                </vaadin-list-box>
              </template>
            </vaadin-select> metadata / page 
          </div>
          <div style="margin: auto"> 
            <vaadin-button on-tap="_goPrev" ><iron-icon icon="vaadin:backwards"></iron-icon></vaadin-button>
            Current page: [[currentPage]]
            <vaadin-button on-tap="_goNext" ><iron-icon icon="vaadin:forward"></iron-icon></vaadin-button>
          </div>
      </div>  
      
     
               
    `;
    }

    static get properties() {
        return {
            q: {
                type: Object,
                notify: true,
            },
            from: {
                type: Number,
                value: 0
            },
            pageSize: {
                type: Number,
                value: 10,
            },
            currentPage: {
                type: Number,
                computed: '_computeCurrentPage(from,pageSize)'
            },
            searchResp: {
                type: Array,
                notify: true
            },
            item: Object,
            items:{
                type: Object,
                notify: true

            }
        };
    }


    ready() {
        super.ready();
        this.$.pageSizeSelect.addEventListener('change',(e) => this._pageSizeChanged(e.target.value));

        this.$.tokenAjaxTypes.url = '/api/assets/types';
        this.$.tokenAjaxTypes._go();
    }

    _guidChanged(){
       console.log('guid changed') ;
    }

    _useCaseChanged(){
        console.log('usecase changed');
    }

    _validateSearch(){
        let validSearch = true;
        if( ! this.$.searchField.validate() ) {
            validSearch = false;
            this.dispatchEvent(new CustomEvent('show-modal', {
                bubbles: true,
                composed: true,
                detail: { message: "Search criteria minimum length is 2 characters !", level: 'error'}}));
        } else if ( ! this.$.combo.validate() ){
            validSearch = false;
            this.dispatchEvent(new CustomEvent('show-modal', {
                bubbles: true,
                composed: true,
                detail: { message: "Please select at least one Open Metadata Type !", level: 'error'}}));
        }
        return validSearch;
    }

    _goNext() {
        if(this.items.length >= this.pageSize){
            this.from += this.pageSize;
            this._fetch();
        }else{
            this.dispatchEvent(new CustomEvent('show-modal', {
                bubbles: true,
                composed: true,
                detail: { message: "Oops! No more metadata for current search!", level: 'error'}}));
        }
    }

    _goPrev() {
        if(this.currentPage > 1){
            this.from -= this.pageSize;
            if(this.from < 0) this.from = 0;
            this._fetch();
        }
    }

    _computeCurrentPage(from,pageSize){
        return Math.ceil(from /pageSize ) + 1;
    }

    _search() {
        this.from = 0;
        this._fetch();
    }

    _pageSizeChanged(value){
        this.pageSize = parseInt(value);
        this.from = 0;
        if(this.q && 0 !== this.q.trim().length){
            this._fetch();
        }
    }

    _fetch(){
        if(  this._validateSearch() ) {
            this.items = [];
            var types = [];
            this.$.combo.selectedItems.forEach(function (item) {
                types.push(item.name);
            });

            this.$.tokenAjax.url = '/api/assets/search?q=' + this.q + '&types=' + types;
            if( this.from > 0 )
                this.$.tokenAjax.url +='&from=' + this.from;
            if( this.pageSize > 0 )
                this.$.tokenAjax.url +='&pageSize=' + this.pageSize;
            this.$.tokenAjax._go();
        }
    }

    _itemName(item){
        if(item.properties.displayName && item.properties.displayName!=null)
            return item.properties.displayName;
        else if(item.properties.name && item.properties.name!=null)
            return item.properties.name;
        else
            return 'N/A';
    }

    attached() {
        this.loadResources(
            // The specified file only contains the flattened translations for that language:
            'locales/'+this.language+'.json',  //e.g. for es {"hi": "hola"}
            this.language,               // unflatten -> {"es": {"hi": "hola"}}
            true                // merge so existing resources won't be clobbered
        );
    }


}



window.customElements.define('asset-search-view', AssetSearchView);