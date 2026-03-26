const API_KEY = import.meta.env.VITE_RESEND_API_KEY

export const sendReservationEmail = async (data: {
    name: string
    itemName: string
    option: {
        store: string
        price: number
        url?: string
    }
}) => {
    await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: 'Home Shower <onboarding@resend.dev>',
            to: ['desarrollopatriciacarreno+homeshower@gmail.com'],
            subject: 'Nuevo regalo 🎁',
            html: `
                <!DOCTYPE html>
                <html>
                <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">

                <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 10px;">
                    <tr>
                    <td align="center">

                        <table width="100%" max-width="520px" cellpadding="0" cellspacing="0"
                        style="background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.1);">

                        <!-- HEADER -->
                        <tr>
                            <td style="background:linear-gradient(135deg,#10b981,#059669);padding:24px;text-align:center;color:#ffffff;">
                            <h2 style="margin:0;font-size:22px;">🎁 ¡Nuevo regalo!</h2>
                            <p style="margin:6px 0 0;font-size:13px;opacity:0.9;">
                                Home Shower
                            </p>
                            </td>
                        </tr>

                        <!-- CONTENT -->
                        <tr>
                            <td style="padding:26px;">

                            <p style="margin:0 0 16px;font-size:15px;color:#374151;text-align:center;">
                                <strong style="color:#111827;">${data.name}</strong> quiere regalarte:
                            </p>

                            <!-- PRODUCT CARD -->
                            <div style="
                                background:#f9fafb;
                                border-radius:14px;
                                padding:20px;
                                text-align:center;
                                margin-bottom:20px;
                                border:1px solid #e5e7eb;
                            ">
                                <h3 style="margin:0;font-size:18px;color:#111827;">
                                ${data.itemName}
                                </h3>
                            </div>

                            <!-- DETAILS -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                                <tr>
                                <td style="font-size:13px;color:#6b7280;">Tienda</td>
                                <td style="font-size:14px;color:#111827;text-align:right;font-weight:600;">
                                    ${data.option.store}
                                </td>
                                </tr>

                                <tr>
                                <td style="font-size:13px;color:#6b7280;padding-top:8px;">Monto</td>
                                <td style="font-size:18px;color:#10b981;text-align:right;font-weight:700;padding-top:8px;">
                                    $${data.option.price.toLocaleString('es-CL')}
                                </td>
                                </tr>
                            </table>

                            ${data.option.url
                                    ? `
                            <!-- BUTTON -->
                            <div style="text-align:center;margin-top:10px;">
                                <a href="${data.option.url}" 
                                style="
                                    display:inline-block;
                                    padding:12px 20px;
                                    background:#10b981;
                                    color:#ffffff;
                                    text-decoration:none;
                                    border-radius:10px;
                                    font-size:14px;
                                    font-weight:600;
                                    box-shadow:0 4px 12px rgba(16,185,129,0.3);
                                ">
                                Ver producto
                                </a>
                            </div>
                            `
                                    : ''
                                }

                            <!-- MESSAGE -->
                            <p style="margin-top:25px;font-size:13px;color:#6b7280;text-align:center;">
                                Gracias por ser parte de este momento 💚
                            </p>

                            </td>
                        </tr>

                        <!-- FOOTER -->
                        <tr>
                            <td style="background:#f9fafb;padding:16px;text-align:center;font-size:11px;color:#9ca3af;">
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
        }),
    })
}