require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const { PayOS } = require('@payos/node');

const app = express();

app.use(express.json({ limit: '60mb' }));

/* Chặn truy cập file nhạy cảm */
app.use((req, res, next) => {

    const blocked = [
        '/.env',
        '/orders.json',
        '/server.js',
        '/package.json',
        '/package-lock.json'
    ];

    if(
        blocked.includes(req.path)
        ||
        req.path.startsWith('/uploads/')
    ){
        return res.sendStatus(404);
    }

    next();

});

app.use(express.static(process.cwd(), {
    dotfiles: 'deny'
}));

const PORT = Number(process.env.PORT || 3000);

const DEPOSIT_AMOUNT = Number(
    process.env.DEPOSIT_AMOUNT || 100000
);

const PAYOS_CLIENT_ID =
    process.env.PAYOS_CLIENT_ID || '';

const PAYOS_API_KEY =
    process.env.PAYOS_API_KEY || '';

const PAYOS_CHECKSUM_KEY =
    process.env.PAYOS_CHECKSUM_KEY || '';

const TELEGRAM_BOT_TOKEN =
    process.env.TELEGRAM_BOT_TOKEN || '';

const TELEGRAM_CHAT_ID =
    process.env.TELEGRAM_CHAT_ID || '';

const DB_FILE =
    path.join(process.cwd(), 'orders.json');
const UPLOAD_ROOT =
    path.join(
        process.cwd(),
        'uploads'
    );

if(!fs.existsSync(UPLOAD_ROOT)){

    fs.mkdirSync(
        UPLOAD_ROOT,
        {
            recursive:true
        }
    );

}


/* =========================
   PAYOS
========================= */

if (
    !PAYOS_CLIENT_ID ||
    !PAYOS_API_KEY ||
    !PAYOS_CHECKSUM_KEY
) {
    console.warn(
        '⚠️ Chưa cấu hình đầy đủ PAYOS_CLIENT_ID / PAYOS_API_KEY / PAYOS_CHECKSUM_KEY'
    );
}

const payOS = new PayOS({
    clientId: PAYOS_CLIENT_ID,
    apiKey: PAYOS_API_KEY,
    checksumKey: PAYOS_CHECKSUM_KEY
});
async function registerPayOSWebhook() {

    try {

        const webhookUrl =
            'https://marcus-earning-impressed-pointer.trycloudflare.com/webhooks/payos';

        const result =
            await payOS.webhooks.confirm(webhookUrl);

        console.log('');
        console.log('✅ Đã đăng ký webhook payOS');
        console.log(result);
        console.log('');

    } catch (error) {

        console.error('');
        console.error(
            '❌ Không đăng ký được webhook payOS:',
            error
        );
        console.error('');

    }

}

/* =========================
   DATABASE
========================= */

let orders = loadOrders();


function loadOrders() {

    try {

        if (!fs.existsSync(DB_FILE)) {
            return {};
        }

        return JSON.parse(
            fs.readFileSync(
                DB_FILE,
                'utf8'
            )
        );

    } catch (error) {

        console.error(
            'Không đọc được orders.json:',
            error
        );

        return {};
    }
}


function saveOrders() {

    fs.writeFileSync(
        DB_FILE,
        JSON.stringify(
            orders,
            null,
            2
        ),
        'utf8'
    );
}


/* =========================
   UTILITIES
========================= */

function formatMoney(value) {

    return Number(value || 0)
        .toLocaleString('vi-VN')
        + '₫';
}
function getSafeExtension(
    filename,
    mimeType
){

    let ext =
        String(filename || '')
        .split('.')
        .pop()
        .toLowerCase();

    const allowed = [
        'jpg',
        'jpeg',
        'png',
        'heic',
        'heif'
    ];

    if(allowed.includes(ext)){
        return ext;
    }

    const mimeMap = {
        'image/jpeg':'jpg',
        'image/png':'png',
        'image/heic':'heic',
        'image/heif':'heif'
    };

    return (
        mimeMap[mimeType]
        ||
        'jpg'
    );
}


function saveDataUrl(
    dataUrl,
    outputPath
){

    if(
        !dataUrl
        ||
        typeof dataUrl !== 'string'
    ){
        return false;
    }

    const match =
        dataUrl.match(
            /^data:([^;]+);base64,(.+)$/
        );

    if(!match){
        return false;
    }

    const buffer =
        Buffer.from(
            match[2],
            'base64'
        );

    fs.writeFileSync(
        outputPath,
        buffer
    );

    return true;
}


function saveOrderFiles(
    code,
    design
){

    const orderFolder =
        path.join(
            UPLOAD_ROOT,
            code
        );

    fs.mkdirSync(
        orderFolder,
        {
            recursive:true
        }
    );


    let finalImage = '';

    if(design.previewImage){

        const finalFilename =
            'final.jpg';

        const finalPath =
            path.join(
                orderFolder,
                finalFilename
            );

        if(
            saveDataUrl(
                design.previewImage,
                finalPath
            )
        ){

            finalImage =
                `/admin-files/${code}/${finalFilename}`;

        }

    }


    const savedStickers = {};

    const stickers =
        design.uploadedStickers
        || {};

    [
        'left',
        'center',
        'right'
    ].forEach(position=>{

        const item =
            stickers[position];

        if(
            !item
            ||
            !item.data
        ){
            return;
        }

        const extension =
            getSafeExtension(
                item.name,
                item.type
            );

        const filename =
            `sticker-${position}.${extension}`;

        const outputPath =
            path.join(
                orderFolder,
                filename
            );

        if(
            saveDataUrl(
                item.data,
                outputPath
            )
        ){

            savedStickers[position] = {

                originalName:
                    item.name
                    ||
                    filename,

                type:
                    item.type
                    || '',

                extension,

                file:
                    `/admin-files/${code}/${filename}`

            };

        }

    });


    return {

        finalImage,

        stickers:
            savedStickers

    };

}
function getSafeExtension(
    filename,
    mimeType
){

    let ext =
        String(filename || '')
        .split('.')
        .pop()
        .toLowerCase();


    const allowed = [
        'jpg',
        'jpeg',
        'png',
        'heic',
        'heif'
    ];


    if(allowed.includes(ext)){
        return ext;
    }


    const mimeMap = {

        'image/jpeg':'jpg',
        'image/png':'png',
        'image/heic':'heic',
        'image/heif':'heif'

    };


    return (
        mimeMap[mimeType]
        ||
        'jpg'
    );
}


function saveDataUrl(
    dataUrl,
    outputPath
){

    if(
        !dataUrl
        ||
        typeof dataUrl !== 'string'
    ){
        return false;
    }


    const match =
        dataUrl.match(
            /^data:([^;]+);base64,(.+)$/
        );


    if(!match){
        return false;
    }


    const buffer =
        Buffer.from(
            match[2],
            'base64'
        );


    fs.writeFileSync(
        outputPath,
        buffer
    );


    return true;
}


function saveOrderFiles(
    code,
    design
){

    const orderFolder =
        path.join(
            UPLOAD_ROOT,
            code
        );


    fs.mkdirSync(
        orderFolder,
        {
            recursive:true
        }
    );


    /* =========================
       ẢNH FINAL
    ========================= */

    let finalImage = '';


    if(design.previewImage){

        const finalFilename =
            'final.jpg';


        const finalPath =
            path.join(
                orderFolder,
                finalFilename
            );


        if(
            saveDataUrl(
                design.previewImage,
                finalPath
            )
        ){

            finalImage =
                `/admin-files/${code}/${finalFilename}`;

        }

    }


    /* =========================
       STICKER KHÁCH UPLOAD
    ========================= */

    const savedStickers = {};


    const stickers =
        design.uploadedStickers
        || {};


    [
        'left',
        'center',
        'right'
    ].forEach(position=>{

        const item =
            stickers[position];


        if(
            !item
            ||
            !item.data
        ){
            return;
        }


        const extension =
            getSafeExtension(
                item.name,
                item.type
            );


        const filename =
            `sticker-${position}.${extension}`;


        const outputPath =
            path.join(
                orderFolder,
                filename
            );


        if(
            saveDataUrl(
                item.data,
                outputPath
            )
        ){

            savedStickers[position] = {

                originalName:
                    item.name
                    ||
                    filename,

                type:
                    item.type
                    || '',

                extension,

                file:
                    `/admin-files/${code}/${filename}`

            };

        }

    });


    return {

        finalImage,

        stickers:
            savedStickers

    };

}

function createOrderCode() {

    const now = new Date();

    const date =
        String(now.getFullYear())
            .slice(-2)
        +
        String(
            now.getMonth() + 1
        ).padStart(2, '0')
        +
        String(
            now.getDate()
        ).padStart(2, '0');


    const random =
        Math.random()
            .toString(36)
            .slice(2, 7)
            .toUpperCase();


    return 'KPU'
        + date
        + random;
}


/*
payOS yêu cầu orderCode là số.
Dùng timestamp + random nhỏ để hạn chế trùng.
*/
function createPayOSOrderCode() {

    const timestamp =
        Date.now()
            .toString()
            .slice(-10);

    const random =
        Math.floor(
            Math.random() * 90 + 10
        );

    return Number(
        timestamp + random
    );
}


/* Convert chuỗi VietQR payOS thành ảnh QR */
function buildQrImageUrl(qrCode) {

    if (!qrCode) {
        return '';
    }

    return (
        'https://api.qrserver.com/v1/create-qr-code/?size=420x420&data='
        + encodeURIComponent(qrCode)
    );
}


function findOrderByPayOSCode(payosOrderCode) {

    return Object.values(orders)
        .find(order => {

            return Number(
                order.payment?.payosOrderCode
            ) === Number(payosOrderCode);

        });
}


function publicOrder(order) {

    return {

        code:
            order.code,

        status:
            order.status,

        createdAt:
            order.createdAt,

        paidAt:
            order.paidAt || null,

        design:
            order.design,

        customer:
            order.customer,

        totals:
            order.totals,

        payment: {

            depositAmount:
                order.payment.depositAmount,
            receivedAmount:
                Number(
                order.payment.receivedAmount || 0
                        ),

            content:
                order.payment.content,

            bank:
                order.payment.bank || 'MB',

            accountNumber:
                order.payment.accountNumber || '',

            accountHolder:
                order.payment.accountHolder || '',

            qrUrl:
                order.payment.qrUrl || '',

            checkoutUrl:
                order.payment.checkoutUrl || '',

            paymentLinkId:
                order.payment.paymentLinkId || ''

        }

    };
}


/* =========================
   1. TẠO ĐƠN
========================= */

app.post(
    '/api/orders',
    async (req, res) => {

        try {

            if (
                !PAYOS_CLIENT_ID ||
                !PAYOS_API_KEY ||
                !PAYOS_CHECKSUM_KEY
            ) {

                return res
                    .status(500)
                    .json({

                        success: false,

                        message:
                            'Server chưa cấu hình payOS trong .env.'

                    });
            }


            const {
                design,
                customer,
                payment
            } = req.body || {};


            if (
                !design ||
                !customer ||
                !payment
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            'Thiếu dữ liệu đơn hàng.'

                    });
            }


            const total =
                Number(
                    payment.total || 0
                );


            if (total <= 0) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            'Tổng đơn hàng không hợp lệ.'

                    });
            }


            const code =
                createOrderCode();
            
            const payosOrderCode =
                createPayOSOrderCode();


            const requestedPaymentAmount =
    Number(
        payment.paymentAmount || 0
    );

const minimumPayment =
    Math.min(
        DEPOSIT_AMOUNT,
        total
    );

const depositAmount =
    requestedPaymentAmount > 0
        ? requestedPaymentAmount
        : minimumPayment;


if(
    depositAmount < minimumPayment
    ||
    depositAmount > total
){

    return res
        .status(400)
        .json({

            success:false,

            message:
                'Số tiền thanh toán phải từ '
                + formatMoney(minimumPayment)
                + ' đến '
                + formatMoney(total)
                + '.'

        });
}


            /*
            Description payOS nên ngắn.
            Dùng mã KPU để người dùng nhìn thấy đúng mã đơn.
            */
            const description =
                code.slice(0, 25);


            /*
            Hai URL này chủ yếu là yêu cầu của payOS.
            Checkout của mình vẫn polling trạng thái webhook.
            */
            const baseUrl =
                `${req.protocol}://${req.get('host')}`;


            const paymentData = {

                orderCode:
                    payosOrderCode,

                amount:
                    depositAmount,

                description,

                buyerName:
                    String(
                        customer.fullName || ''
                    ).slice(0, 255),

                buyerPhone:
                    String(
                        customer.phone || ''
                    ).slice(0, 20),

                buyerAddress:
                    String(
                        customer.address || ''
                    ).slice(0, 255),

                cancelUrl:
                    baseUrl
                    + '/checkout.html?payment=cancel',

                returnUrl:
                    baseUrl
                    + '/checkout.html?payment=success'

            };


            console.log(
                'Đang tạo payment payOS:',
                payosOrderCode,
                code
            );


            const payosPayment =
                await payOS.paymentRequests
                    .create(paymentData);
            const savedFiles =
    saveOrderFiles(
        code,
        design
    );

const cleanDesign = {

    ...design,

    previewImage:
        savedFiles.finalImage,

    uploadedStickers:
        savedFiles.stickers

};

            console.log(
                'payOS tạo payment thành công:',
                payosPayment.paymentLinkId
            );


            const order = {

                code,

                status:
                    'pending',

                createdAt:
                    new Date()
                        .toISOString(),

                paidAt:
                    null,

                design:
                    cleanDesign,

                customer,

                totals: {

                    productPrice:
                        Number(
                            payment.productPrice || 0
                        ),

                    shippingFee:
                        Number(
                            payment.shippingFee || 0
                        ),

                    promoCode:
                        String(
                            payment.promoCode || ''
                        ),

                    discount:
                        Number(
                            payment.discount || 0
                        ),

                    total

                },

                payment: {

                    depositAmount,

                    content:
                        payosPayment.description
                        || description,

                    bank:
                        'MB',

                    accountNumber:
                        payosPayment.accountNumber
                        || '',

                    accountHolder:
                        payosPayment.accountName
                        || '',

                    qrCode:
                        payosPayment.qrCode
                        || '',

                    qrUrl:
                        buildQrImageUrl(
                            payosPayment.qrCode
                        ),

                    checkoutUrl:
                        payosPayment.checkoutUrl
                        || '',

                    paymentLinkId:
                        payosPayment.paymentLinkId
                        || '',

                    payosOrderCode,

                    transactionId:
                        null,

                    referenceCode:
                        null,

                    receivedAmount:
                        0

                }

            };


            orders[code] =
                order;


            saveOrders();


            return res.json({

                success: true,

                order:
                    publicOrder(order)

            });

        } catch (error) {

            console.error(
                'Tạo đơn payOS lỗi:',
                error
            );


            return res
                .status(500)
                .json({

                    success: false,

                    message:
                        error?.message
                        || 'Không tạo được QR thanh toán.'

                });
        }

    }
);


/* =========================
   2. CHECK TRẠNG THÁI
========================= */

app.get(
    '/api/orders/:code/status',
    (req, res) => {

        const code =
            String(
                req.params.code || ''
            )
                .toUpperCase();


        const order =
            orders[code];


        if (!order) {

            return res
                .status(404)
                .json({

                    success: false,

                    message:
                        'Không tìm thấy đơn hàng.'

                });
        }


        return res.json({

            success: true,

            status:
                order.status,

            order:
                publicOrder(order)

        });

    }
);


/* =========================
   3. WEBHOOK PAYOS
========================= */

app.post(
    '/webhooks/payos',
    async (req, res) => {

        /*
        Quan trọng:
        payOS cần nhận HTTP 2xx.
        Nhưng chỉ đánh dấu paid sau khi verify chữ ký.
        */

        try {

            console.log('');
            console.log('=== PAYOS WEBHOOK ===');


            const verifiedData =
                await payOS.webhooks
                    .verify(req.body);


            console.log(
                'Webhook hợp lệ:',
                verifiedData
            );


            const payosOrderCode =
                Number(
                    verifiedData.orderCode
                );


            const order =
                findOrderByPayOSCode(
                    payosOrderCode
                );


            if (!order) {

                console.log(
                    'Không tìm thấy đơn nội bộ cho payOS orderCode:',
                    payosOrderCode
                );


                return res.json({
                    success: true
                });
            }


            /*
            payOS có thể gửi webhook xác minh mẫu khi đăng ký.
            Chỉ xử lý nếu transaction thành công.
            */
            if (
                String(
                    verifiedData.code || ''
                ) !== '00'
            ) {

                return res.json({
                    success: true
                });
            }


            if (
                order.status === 'paid'
            ) {

                return res.json({
                    success: true
                });
            }


            const receivedAmount =
                Number(
                    verifiedData.amount || 0
                );


            if (
                receivedAmount <
                Number(
                    order.payment
                        .depositAmount || 0
                )
            ) {

                console.log(
                    'Số tiền nhận chưa đủ:',
                    receivedAmount
                );


                return res.json({
                    success: true
                });
            }


            order.status =
                'paid';


            order.paidAt =
                new Date()
                    .toISOString();


            order.payment.transactionId =
                verifiedData.reference
                || null;


            order.payment.referenceCode =
                verifiedData.reference
                || null;


            order.payment.receivedAmount =
                receivedAmount;


            saveOrders();


            console.log(
                '✅ ĐÃ THANH TOÁN:',
                order.code,
                receivedAmount
            );


            try {

                await sendTelegram(
                    order,
                    verifiedData
                );

            } catch (error) {

                console.error(
                    'Telegram lỗi:',
                    error
                );
            }


            return res.json({
                success: true
            });

        } catch (error) {

    console.error(
        'Webhook payOS chưa xác minh được:',
        error
    );

    /*
    Không đánh dấu đơn là paid.
    Chỉ trả 200 để payOS hoàn tất bước
    kiểm tra URL webhook.
    */
    return res
        .status(200)
        .json({
            success: true,
            ignored: true
        });
}
    }
);


/* =========================
   4. TELEGRAM
========================= */

async function sendTelegram(
    order,
    transaction
) {

    if (
        !TELEGRAM_BOT_TOKEN ||
        !TELEGRAM_CHAT_ID
    ) {

        console.log(
            'Chưa cấu hình Telegram, bỏ qua thông báo.'
        );

        return;
    }


    const remaining =
    Math.max(
        0,
        Number(
            order.totals.total || 0
        )
        -
        Number(
            order.payment.receivedAmount || 0
        )
    );


const message = [

    '🟢 CÓ ĐƠN HÀNG MỚI',

    '',

    '🧾 Mã đơn: '
    + order.code,

    '👤 Khách hàng: '
    + (
        order.customer.fullName || ''
    ),

    '📞 SĐT: '
    + (
        order.customer.phone || ''
    ),

    '',

    '💳 Đã thanh toán: '
    + formatMoney(
        order.payment.receivedAmount
    ),

    '📦 Còn lại khi nhận hàng: '
    + formatMoney(
        remaining
    )

]
.join('\n');


    const url =

        'https://api.telegram.org/bot'

        + TELEGRAM_BOT_TOKEN

        + '/sendMessage';


    const response =
        await fetch(
            url,
            {

                method: 'POST',

                headers: {

                    'Content-Type':
                        'application/json'

                },

                body:
                    JSON.stringify({

                        chat_id:
                            TELEGRAM_CHAT_ID,

                        text:
                            message

                    })

            }
        );


    const body =
        await response.json();


    if (
        !response.ok ||
        !body.ok
    ) {

        throw new Error(

            body.description

            ||

            'Telegram sendMessage thất bại.'

        );
    }
}


/* =========================
   5. TEST SERVER
========================= */

app.get(
    '/api/health',
    (req, res) => {

        res.json({

            success: true,

            payosConfigured:
                Boolean(
                    PAYOS_CLIENT_ID
                    &&
                    PAYOS_API_KEY
                    &&
                    PAYOS_CHECKSUM_KEY
                )

        });

    }
);

const ADMIN_KEY =
    process.env.ADMIN_KEY || '';


function requireAdmin(
    req,
    res,
    next
){

    const key =
        req.get('X-Admin-Key')
        ||
        req.query.key
        ||
        '';

    if(
        !ADMIN_KEY
        ||
        key !== ADMIN_KEY
    ){

        return res
            .status(401)
            .json({
                success:false,
                message:
                    'Không có quyền truy cập.'
            });

    }

    next();

}


/* DANH SÁCH ĐƠN */

app.get(
    '/api/admin/orders',
    requireAdmin,
    (req,res)=>{

        const list =
            Object
            .values(orders)
            .sort(
                (a,b)=>
                    new Date(b.createdAt)
                    -
                    new Date(a.createdAt)
            );

        res.json({
            success:true,
            orders:list
        });

    }
);


/* CHI TIẾT ĐƠN */

app.get(
    '/api/admin/orders/:code',
    requireAdmin,
    (req,res)=>{

        const code =
            String(
                req.params.code || ''
            )
            .toUpperCase();

        const order =
            orders[code];

        if(!order){

            return res
                .status(404)
                .json({
                    success:false,
                    message:
                        'Không tìm thấy đơn.'
                });

        }

        res.json({
            success:true,
            order
        });

    }
);


/* XEM / TẢI FILE */

app.get(
    '/admin-files/:code/:filename',
    requireAdmin,
    (req,res)=>{

        const code =
            String(
                req.params.code || ''
            )
            .replace(
                /[^A-Z0-9]/gi,
                ''
            );

        const filename =
            path.basename(
                req.params.filename || ''
            );

        const filePath =
            path.join(
                UPLOAD_ROOT,
                code,
                filename
            );

        if(
            !fs.existsSync(filePath)
        ){

            return res
                .status(404)
                .send(
                    'Không tìm thấy file.'
                );

        }

        res.sendFile(
            filePath
        );

    }
);
/* =========================
   START SERVER
========================= */

app.listen(
    PORT,
    () => {

        console.log('');

        console.log(
            'The.Keepus server đang chạy:'
        );

        console.log(
            'http://localhost:'
            + PORT
        );

        console.log('');

        console.log(
            'Webhook payOS:'
        );

        console.log(
    'https://marcus-earning-impressed-pointer.trycloudflare.com/webhooks/payos'
);

        console.log('');

        registerPayOSWebhook();

    }
);