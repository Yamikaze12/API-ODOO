odoo.define('portal_report_bsp.product_divisi_renderer', function (require) {
    "use strict";

    var ListRenderer = require('web.ListRenderer');
    var rpc = require('web.rpc');
    var _t = core._t;

    var DECORATIONS = [
        'decoration-bf',
        'decoration-it',
        'decoration-danger',
        'decoration-info',
        'decoration-muted',
        'decoration-primary',
        'decoration-success',
        'decoration-warning'
    ];

    var FIELD_CLASSES = {
        char: 'o_list_char',
        float: 'o_list_number',
        integer: 'o_list_number',
        monetary: 'o_list_number',
        text: 'o_list_text',
        many2one: 'o_list_many2one',
    };

    var ProductDivisiRenderer = ListRenderer.extend({
        _renderView: async function () {
            await this._super.apply(this, arguments);
            $(this.el).find('.o_list_table').addClass('product-divisi-tree');
            this._addEllipsisToThead();
        },

        _addEllipsisToThead: function() {
            var self = this;
            var $ellipsisIcon = $('<i>', {
                class: 'o_optional_columns_dropdown_toggle_costum fa fa-ellipsis-v',
                click: function () { self._onEllipsisClick(); }
            });
            $(this.el).find('.o_list_table thead th').last().append($ellipsisIcon);
        },

        _onEllipsisClick: function() {
            var self = this;
            $('.dropdown-item-text text-center o_no_activity d-flex justify-content-center').hide();
            if (!self.$dropdownMenu || self.$dropdownMenu.is(':hidden')) {
                rpc.query({
                    model: this.state.model,
                    method: 'fields_get',
                }).then(function(fields) {
                    self._createDropdownMenu(fields);
                });
            } else {
                self._removeDropdownMenu();
            }
        },

        _createDropdownMenu: function(fields) {
            var self = this;
            var $dropdownMenu = $('<ul>', { class: 'dropdown-menu' });

            $.each(fields, function(fieldName, fieldInfo) {
                var $listItem = $('<li>');
        
                var $checkbox = $('<input>', {
                    type: 'checkbox',
                    id: 'checkbox_' + fieldName,
                    name: fieldName,
                    checked: self.state.fields[fieldName].selected
                });

                var $label = $('<label>', {
                    for: 'checkbox_' + fieldName,
                    text: fieldInfo.string || fieldName
                });

                $listItem.append($checkbox).append($label);
        
                $dropdownMenu.append($listItem);
            });

            var $ellipsisIcon = $(this.el).find('.o_optional_columns_dropdown_toggle_costum');
            var iconPos = $ellipsisIcon.offset();
            var scrollTop = $(window).scrollTop();

            $dropdownMenu.css({
                'position': 'absolute',
                'left': iconPos.left - $(this.el).find('.o_list_table').offset().left, // Posisi horizontal
                'top': iconPos.top - scrollTop + $ellipsisIcon.outerHeight(), // Posisi vertikal
                'z-index': 100 // Pastikan dropdown menu muncul di atas elemen lainnya
            });

            $('body').append($dropdownMenu);
            $dropdownMenu.show();
        
            $(document).on('click', function(event) {
                if (!$.contains($dropdownMenu[0], event.target) && !$(event.target).is('.o_optional_columns_dropdown_toggle_costum')) {
                    $dropdownMenu.remove();
                }
            });

            $dropdownMenu.find('input[type="checkbox"]').on('change', function(event) {
                var fieldName = $(this).attr('name');
                var checked = $(this).is(':checked');
            });
        },
        
        
    });

    return ProductDivisiRenderer;
});
