var qr = require('qr-image');

/**
 *  Generate a QR Code 
 */
exports.generate = function (req, res, next) {
  var url = req.params.url;
  var qr_svg = qr.image(url, { type: 'svg' });
  qr_svg.pipe(require('fs').createWriteStream('./app/images/qrcode.svg'));
  return res.json({qrCode: "/images/qrcode.svg"});
};
