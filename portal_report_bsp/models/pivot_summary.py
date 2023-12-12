from odoo import models, fields, api

class PivotSummary(models.Model):
    _name = 'pivot.summary'
    
    kode_cabang = fields.Char()
    kode_barang = fields.Char()
    group_jenis_outlet = fields.Char()
    harga_gross = fields.Char()
    harga_jual = fields.Char()
    ttl_brg_terjual = fields.Char()
    tgl_faktur = fields.Date()
    
    # def action_export_excel_pivot_stock(self):
    #     ids = ','.join(map(str, self.ids)) 
    #     base_url = self.env['ir.config_parameter'].sudo().get_param('web.base.url')
    #     redirect_url = "{}/pivot_stock/export_excel?ids={}".format(base_url, ids)
    #     return {
    #         'type': 'ir.actions.act_url',
    #         'url': redirect_url,
    #         'target': 'self'
    #     }