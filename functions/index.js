const functions = require('firebase-functions')
const admin = require('firebase-admin')
const { Resend } = require('resend')

admin.initializeApp()

const resend = new Resend('re_RrUeVzZo_NieNEi6SF4eBQT332GBKQAj5')

exports.onReservationCreated = functions.firestore
    .document('reservations/{id}')
    .onCreate(async (snap) => {
        const data = snap.data()

        const { name, itemName, option } = data

        await resend.emails.send({
            from: 'Home Shower <onboarding@resend.dev>',
            to: ['desarrollopatriciacarreno@gmail.com'],
            subject: 'Nuevo regalo 🎁',
            html: `
                    <!DOCTYPE html>
                    <html>
                    <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
                        <tr>
                            <td align="center">

                            <table width="100%" max-width="520px" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1);">

                                <!-- HEADER -->
                                <tr>
                                <td style="background:#10b981;padding:20px;text-align:center;color:#ffffff;">
                                    <h2 style="margin:0;font-size:20px;">🎁 Nuevo regalo</h2>
                                    <p style="margin:5px 0 0;font-size:14px;opacity:0.9;">Home Shower</p>
                                </td>
                                </tr>

                                <!-- CONTENT -->
                                <tr>
                                <td style="padding:25px;">

                                    <p style="margin:0 0 15px;font-size:15px;color:#374151;">
                                    <strong style="color:#111827;">${name}</strong> te regalará:
                                    </p>

                                    <div style="background:#f9fafb;border-radius:12px;padding:18px;text-align:center;margin-bottom:20px;">
                                    <h3 style="margin:0;font-size:18px;color:#111827;">${itemName}</h3>
                                    </div>

                                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                                    <tr>
                                        <td style="font-size:14px;color:#6b7280;">Tienda</td>
                                        <td style="font-size:14px;color:#111827;text-align:right;font-weight:600;">
                                        ${option.store}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="font-size:14px;color:#6b7280;padding-top:6px;">Monto</td>
                                        <td style="font-size:16px;color:#2563eb;text-align:right;font-weight:700;padding-top:6px;">
                                        $${option.price.toLocaleString('es-CL')}
                                        </td>
                                    </tr>
                                    </table>

                                    ${option.url
                                        ? `
                                    <div style="text-align:center;margin-top:10px;">
                                    <a href="${option.url}" 
                                        style="display:inline-block;padding:10px 18px;background:#10b981;color:#ffffff;text-decoration:none;border-radius:10px;font-size:14px;font-weight:600;">
                                        Ver producto
                                    </a>
                                    </div>
                                    `
                                        : ''
                                    }

                                </td>
                                </tr>

                                <!-- FOOTER -->
                                <tr>
                                <td style="background:#f9fafb;padding:15px;text-align:center;font-size:12px;color:#9ca3af;">
                                    Este correo fue generado automáticamente ✨
                                </td>
                                </tr>

                            </table>

                            </td>
                        </tr>
                        </table>

                    </body>
                    </html>
                    `,
        })
    })