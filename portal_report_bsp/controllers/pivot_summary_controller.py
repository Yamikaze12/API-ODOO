from odoo import http
from odoo.http import request, content_disposition
import logging
import io
import xlsxwriter
from requests.exceptions import ConnectionError, RequestException

_logger = logging.getLogger(__name__)

class PivotSummaryController(http.Controller):
    
    @http.route('/pivot-summary-import', type='http', auth='public', csrf=False)
    def import_konsolidasi_cocba(self, **kwargs):
        konsolidasi_model = request.env['konsolidasi.master'].sudo()
        pivot_summary_model = request.env['pivot.summary'].sudo()

        konsolidasi_data = konsolidasi_model.search([])
        query = """
            SELECT DISTINCT kode_cabang, kode_barang, flag_barang AS 'group jenis outlet', gross AS 'harga gross', 
            hargasat_Yjual_terkecil AS 'harga jual terkecil', COUNT(*) AS 'terjual', tgl_faktur FROM dw_tr_sp_faktur_mix_konsolidasi WHERE kode_cabang IN ('BDG','BLG') AND flagsales="FAKTUR" AND tgl_faktur = DATE_FORMAT(NOW(), '%Y-%m-%d')
            GROUP BY kode_barang
        """

        request.env.cr.execute(query)
        result = request.env.cr.fetchall()
        for rec in result:
            tgl_stock, kode_cabang, kode_principal, kode_divisi_produk_id, nama_barang_id, kode_barang, ssl_data, stock = rec
            existing_record = pivot_summary_model.search([
                ('tgl_stock', '=', tgl_stock),
                ('kode_cabang', '=', kode_cabang),
                ('kode_principal', '=', kode_principal),
                ('Kode_Divisi_Produk_id', '=', kode_divisi_produk_id),
                ('nama_barang_id', '=', nama_barang_id),
                ('kode_barang', '=', kode_barang),
            ], limit=1)
            if not existing_record:
                pivot_summary_model.create({
                    'tgl_stock': tgl_stock,
                    'kode_cabang': kode_cabang,
                    'kode_principal': kode_principal,
                    'Kode_Divisi_Produk_id': kode_divisi_produk_id,
                    'nama_barang_id': nama_barang_id,
                    'kode_barang': kode_barang,
                    'rev_ssl': ssl_data,
                    'avail_akhir': stock,
                })
                request.env.cr.commit()
        
        action = request.env['ir.actions.act_window'].sudo().search([('name', '=', 'Pivot Summary')], limit=1)
        action_id = action.id if action else None

        menu = request.env['ir.ui.menu'].sudo().search([('name', '=', 'Pivot Summary')], limit=1)
        menu_id = menu.id if menu else None

        return request.redirect(f'/web#action={action_id}&menu_id={menu_id}')