import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendCheckoutEmail(
    to: string,
    matchName: string,
    formattedTime: string,
    cartItems: any[],
  ) {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const rows = cartItems  
      .map(
        (item) => `
        <tr>
          <td>${item.area}</td>
          <td>${item.quantity}</td>
          <td>${(item.price * item.quantity).toLocaleString()} đ</td>
        </tr>
      `,
      )
      .join('');

    await this.transporter.sendMail({
      from: `"Ticket System" <${process.env.MAIL_USER}>`,
      to,
      subject: 'Xác nhận thanh toán vé 🎉',
      html: `
      <h2>Thanh toán thành công!</h2>
      <p><b>Trận đấu:</b> ${matchName}</p>
      <p><b>Thời gian:</b> ${formattedTime}</p>

      <table border="1" cellpadding="8" cellspacing="0">
        <thead>
          <tr>
            <th>Khu vực</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
            ${rows}
        </tbody>
      </table>

      <h3>Tổng cộng: ${total.toLocaleString()} đ</h3>
      <p>Cảm ơn bạn đã đặt vé ❤️</p>
    `,
    });
  }
}
