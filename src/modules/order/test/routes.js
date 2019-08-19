'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Order = mongoose.model('Order');

var credentials,
    token,
    mockup,
    importMock;

describe('Order CRUD routes tests', function () {

    before(function (done) {
        importMock = { "filename": "ImportConsignmentNote -V1.xlsx", "data": [{ "sendercode": "PBL", "recipientname": "รัตนา ภิรมณ์ยินดี (แผนกโครงการ)​", "address": "เลขที่ 31 หมู่ 2 ต. นาจอมเทียน อ. สัตหีบ จ. ชลบุรี", "postcode": "20250", "mobile": "0863350155", "contactperson": "รัตนา ภิรมณ์ยินดี (แผนกโครงการ)​", "phoneno": "0863350155", "remark": "05=2, 06=1\r\n02=3, 11=2\r\n08=1, 09=1\r\n03=1, 12=1", "totalbox": "1", "mini_02": 3, "mini_03": 1, "mini_05": 2, "mini_06": 1, "mini_08": 1, "mini_09": 1, "mini_11": 2, "mini_12": 1 }, { "sendercode": "PBL", "recipientname": "สุภาภรณ์  ภูมิชิน", "address": "ป.พัน102  ค่ายพรมโยธี\r\nซอย..น.8\r\nต.ไม้เค็ด   อ.เมือง จ.ปราจีนบุรี", "postcode": "25230", "mobile": "0822062670", "contactperson": "สุภาภรณ์  ภูมิชิน", "phoneno": "0822062670", "codamount": 300, "remark": "08=4 แท่ง\r\n", "totalbox": "1", "mini_08": 4 }, { "sendercode": "PBL", "recipientname": "วรรณภา แก้วทอง  (ร้านสักป่าไร่)", "address": "232ม.8\r\nต.ป่าไร่\r\nอ.อรัญ\r\nจ.สระเเก้ว ", "postcode": "27120", "mobile": "0996856714", "contactperson": "วรรณภา แก้วทอง  (ร้านสักป่าไร่)", "phoneno": "0996856714", "codamount": 300, "remark": "03=1\r\n04=1\r\n05=1\r\n09=1", "totalbox": "1", "mini_03": 1, "mini_04": 1, "mini_05": 1, "mini_09": 1 }, { "sendercode": "PBL", "recipientname": "เขมสรณ์ โยธี", "address": "บจก มูราโมโต้อีเล็คตรอน\r\n1หมู่6 ซ.วัดเสาธงนอก ต.บางเสาธง อ.บางเสาธง จ.สมุทรปราการ. ", "postcode": "10570", "mobile": "0621063253", "contactperson": "เขมสรณ์ โยธี", "phoneno": "0621063253", "codamount": 2100, "remark": "01=10, 02=2\r\n03=3, 04=5\r\n05=4, 06=8\r\n07=1, 08=1\r\n09=7, 10=5\r\n12=4", "totalbox": "1", "mini_01": 10, "mini_02": 2, "mini_03": 3, "mini_04": 5, "mini_05": 4, "mini_06": 8, "mini_07": 1, "mini_08": 1, "mini_09": 7, "mini_10": 5, "mini_12": 4 }, { "sendercode": "PBL", "recipientname": "วิลัยวรรณ กันต๊ะไชย", "address": " 43/24 บริษัทโรม่าอุตสาหกรรมจำกัด ซ.วัดกำแพง ถ.พระราม2 เขตบางขุนเทียน กทม.", "postcode": "10150", "mobile": "0970357098", "contactperson": "วิลัยวรรณ กันต๊ะไชย", "phoneno": "0970357098", "remark": "03=3, 09=5\r\n02=1, 11=1\r\n05=1, 01=1", "totalbox": "1", "mini_01": 1, "mini_02": 1, "mini_03": 3, "mini_05": 1, "mini_09": 5, "mini_11": 1 }, { "sendercode": "PBL", "recipientname": "คุณศิริธร ศรีอ่อน (อ๋อย)", "address": "TVC CONDO เลขที่ 5259/230 ชั้น11 ถนนประชาสงเคราะห์ ดินแดง กทม", "postcode": "10400", "mobile": "0854675796", "contactperson": "คุณศิริธร ศรีอ่อน (อ๋อย)", "phoneno": "0854675796", "remark": "9=3\r\n5=1", "totalbox": "1", "mini_05": 1, "mini_09": 3 }, { "sendercode": "PBL", "recipientname": "อรณัชชา ปักธงไชย", "address": "ส่ง 1,14 โรงแรมระรินจินดา(แผนกDeck1)\r\nถ.เจริญราษฎร์ ต.วัดเกต อ.เมือง จ.เชียงใหม่ ", "postcode": "50000", "mobile": "0876612798", "contactperson": "อรณัชชา ปักธงไชย", "phoneno": "0876612798", "remark": "01=2\r\n04=3\r\n06=2\r\n12=1", "totalbox": "1", "mini_01": 2, "mini_04": 3, "mini_06": 2, "mini_12": 1 }, { "sendercode": "PBL", "recipientname": "ราตรี​ จันทร์ทิพย์", "address": "360​ ม.1\r\nต.กระโพ​ อ.ท่าตูม​ จ.สุรินทร์", "postcode": "32120", "mobile": "0810724977​", "contactperson": "ราตรี​ จันทร์ทิพย์", "phoneno": "0810724977​", "remark": "01=20, 02=20\r\n03=30, 04=20\r\n05=25, 06=10\r\n07=10, 08=20\r\n09=20, 10=10\r\n11=10, 12=20", "totalbox": "1", "mini_01": 20, "mini_02": 20, "mini_03": 30, "mini_04": 20, "mini_05": 25, "mini_06": 10, "mini_07": 10, "mini_08": 20, "mini_09": 20, "mini_10": 10, "mini_11": 10, "mini_12": 20 }, { "sendercode": "PBL", "recipientname": "น.สจิราวดี สุวรรณรักษ์", "address": "27/2ม.7 ถ.สายเอเชีย ต.นาหม่อม อ.นาหม่อม จ.สงขลา\r\n(ส่งที่อเมซอน) ", "postcode": "90310", "mobile": "0937599562", "contactperson": "น.สจิราวดี สุวรรณรักษ์", "phoneno": "0937599562", "codamount": 139, "remark": "05=1", "totalbox": "1", "mini_05": 1 }, { "sendercode": "PBL", "recipientname": "น. ส. พิสมัย จันทะมัน", "address": "บริษัท ไดน่าแพคส์ จำกัด\r\n297/2 หมู่ที่2 ซ. วิรุณราษฎร์ ถ. เศรษฐกิจ1 \r\nต. อ้อมน้อย อ. กระทุ่มแบน จ. สมุทรสาคร", "postcode": "74130", "mobile": "0930867970", "contactperson": "น. ส. พิสมัย จันทะมัน", "phoneno": "0930867970", "codamount": 300, "remark": "03\r\n05\r\n09\r\n11", "totalbox": "1", "mini_03": 1, "mini_05": 1, "mini_09": 1, "mini_11": 1 }, { "sendercode": "PBL", "recipientname": "สุภาพร พิพัฒน์ผล", "address": "131/3 ม.7 ต.ท่างิ้ว อ.เมือง จ.นครศรีธรรมราช", "postcode": "80280", "mobile": "0948050124", "contactperson": "สุภาพร พิพัฒน์ผล", "phoneno": "0948050124", "codamount": 300, "remark": "09-4", "totalbox": "1", "mini_09": 4 }, { "sendercode": "PBL", "recipientname": "นิพภา  อเบล ", "address": "ร้าน99ยันดึก\r\nเลขที่ 112/123 ถนน เอกาทศรฐ ต.ในเมือง อ.เมือง จ.พิษณุโลก", "postcode": "65000", "mobile": "0625698258", "contactperson": "นิพภา  อเบล ", "phoneno": "0625698258", "remark": "04/5\r\n06/2\r\n10/1", "totalbox": "1", "mini_04": 5, "mini_06": 2, "mini_10": 1 }, { "sendercode": "PBL", "recipientname": "ลีลานุช จันทร์มูล", "address": "บริษัท ทียูที เทค จำจัด\r\n64/5 หมู่12\r\nซ.ธนสิทธิ์\r\nต.บางปลา\r\nอ.บางพลี\r\nจ.สมุทรปราการ", "postcode": "10540", "mobile": "0860027117", "contactperson": "ลีลานุช จันทร์มูล", "phoneno": "0860027117", "remark": "01=1\r\n03=1\r\n06=1\r\n10=1", "totalbox": "1", "mini_01": 1, "mini_03": 1, "mini_06": 1, "mini_10": 1 }, { "sendercode": "PBL", "recipientname": "ภาพร สุขแสวง", "address": "2032/22 ถ.ประชาสงเคราะห์ แขวงดินแดง เขตดินแดง จ.กรุงเทพมหานคร", "postcode": "10400", "mobile": "0946713883", "contactperson": "ภาพร สุขแสวง", "phoneno": "0946713883", "remark": "06=2, 09=2\r\n12=1", "totalbox": "1", "mini_06": 1, "mini_09": 2, "mini_12": 1 }, { "sendercode": "PBL", "recipientname": "คุณพรชนก ต๊ะพันธ์ (แผนกบาร์น้ำ)", "address": "บริษัท ซีพีเอ็น โคราชจำกัด สาขาที่00001 \r\n990,998 ถนนมิตรภาพ-หนองคาย\r\nต.ในเมือง อ.เมือง จ.นครราชสีมา ", "postcode": "30000", "mobile": "0855983809", "contactperson": "คุณพรชนก ต๊ะพันธ์ (แผนกบาร์น้ำ)", "phoneno": "0855983809", "remark": "02=1, 03=2\r\n04=2, 05=2\r\n06=2, 8=1\r\n09=2, 10=2\r\n11=1, 12=1", "totalbox": "1", "mini_02": 1, "mini_03": 2, "mini_04": 2, "mini_05": 2, "mini_06": 2, "mini_08": 1, "mini_09": 2, "mini_10": 2, "mini_11": 1, "mini_12": 1 }, { "sendercode": "PBL", "recipientname": "สีดา  จันทร์แจ้ง", "address": "5 หมู่ 1 ต.นาสีนวน อ.เมือง\r\nจ.มุกดาหาร", "postcode": "49000", "mobile": "0959914672", "contactperson": "สีดา  จันทร์แจ้ง", "phoneno": "0959914672", "remark": "05=4", "totalbox": "1", "mini_05": 4 }, { "sendercode": "PBL", "recipientname": "รัชนีพร จำปาสุริ", "address": "5/8 ฟากเลย ต.กุดป่อง อ.เมือง จ.เลย", "postcode": "42000", "mobile": "0933458701", "contactperson": "รัชนีพร จำปาสุริ", "phoneno": "0933458701", "codamount": 420, "remark": "01=1\r\n02=1\r\n05=1\r\n09=1\r\n11=4", "totalbox": "1", "mini_01": 1, "mini_02": 1, "mini_05": 1, "mini_09": 1, "mini_11": 4 }, { "sendercode": "PBL", "recipientname": "รุ่งตะวัน โพธิบัติ", "address": "149/12หมู่5 บ.หินชะโงก\r\nต.โพธิ์ทอง \r\nอ.ปางศิลาทอง\r\nจ.กำแพงเพชร", "postcode": "62120", "mobile": "0934573456", "contactperson": "รุ่งตะวัน โพธิบัติ", "phoneno": "0934573456", "codamount": 208, "remark": "01=1\r\n09=1", "totalbox": "1", "mini_01": 1, "mini_09": 1 }, { "sendercode": "PBL", "recipientname": "วันวิสาข์ โพธิ์คีรี", "address": "189/41 ม.1 \r\nมบ.ศุภลัยวิลล์ศรีสมาน ซ.2 ถ.ปทุมธานี(สายใน) \r\nต.บางขะแยง อ.เมืองปทุมธานี", "postcode": "12000", "mobile": "0808615398", "contactperson": "วันวิสาข์ โพธิ์คีรี", "phoneno": "0808615398", "remark": "01=2, 02=1\r\n03=2, 04=2\r\n05=2, 06=1\r\n07=1, 08=1\r\n09=2, 10=1\r\n11=1, 12=1", "totalbox": "1", "mini_01": 2, "mini_02": 1, "mini_03": 2, "mini_04": 2, "mini_05": 2, "mini_06": 1, "mini_07": 1, "mini_08": 1, "mini_09": 2, "mini_10": 1, "mini_11": 1, "mini_12": 1 }, { "sendercode": "PBL", "recipientname": "แม่ก้อย เกษตร มือใหม่", "address": "113  หมู่ 8  \r\nต  หนองบัว \r\nอ พัฒนานิคม\r\n  จ ลพบุรี", "postcode": "15140", "mobile": "0822410408", "contactperson": "แม่ก้อย เกษตร มือใหม่", "phoneno": "0822410408", "codamount": 300, "remark": "01-1\r\n03-1\r\n09-1\r\n12-1", "totalbox": "1", "mini_01": 1, "mini_03": 1, "mini_09": 1, "mini_12": 1 }, { "sendercode": "PBL", "recipientname": "น.ส.รุ่งทิวา ขันสิงหา", "address": "14/402หมู่5 บ้านกานดา\r\nต.พันท้ายนรสิงห์ อ.เมือง จ.สมุทรสาคร", "postcode": "74000", "mobile": "0969600439", "contactperson": "น.ส.รุ่งทิวา ขันสิงหา", "phoneno": "0969600439", "remark": "01=1, 03=4\r\n04=1, 05=2\r\n09=4, 12=1", "totalbox": "1", "mini_01": 1, "mini_03": 4, "mini_04": 1, "mini_05": 2, "mini_09": 4, "mini_12": 1 }, { "sendercode": "PBL", "recipientname": "น.ส.รัชนี  เข็มแสง", "address": "232 ม.6 ต.วังหว้า\r\nอ.ศรีประจันต์\r\nจ.สุพรรณบุรี", "postcode": "72140", "mobile": "0845716451", "contactperson": "น.ส.รัชนี  เข็มแสง", "phoneno": "0845716451", "codamount": 139, "remark": "03-1", "totalbox": "1", "mini_03": 1 }, { "sendercode": "PBL", "recipientname": "คุณ ปิยวรรณ เอ้งฉ้วน", "address": "รพ.วังวิเศษ 239. ม.7 ต.วังมะปรางเหนือ อ.วังวิเศษ จ.ตรัง", "postcode": "92220", "mobile": "0805196051", "contactperson": "คุณ ปิยวรรณ เอ้งฉ้วน", "phoneno": "0805196051", "remark": "Ayu19-168\r\n01=40, 02=50\r\n03=40, 04=50\r\n05=30, 06=40\r\n07=30, 08=40\r\n09=70, 10=30\r\n11=30, 12=50", "totalbox": "1", "mini_01": 40, "mini_02": 50, "mini_03": 40, "mini_04": 50, "mini_05": 30, "mini_06": 40, "mini_07": 30, "mini_08": 40, "mini_09": 70, "mini_10": 30, "mini_11": 30, "mini_12": 50 }, { "sendercode": "PBL", "recipientname": "ผู้รับ Sa-udi bin mohd hussin", "address": "NO 9 JLN NURI INDAH TAMAN NURI INDAH PULAU PINANG\r\n(NIBONG TEBAL)", "postcode": "14300", "mobile": "0175259192", "contactperson": "ผู้รับ Sa-udi bin mohd hussin", "phoneno": "0175259192", "remark": "Ayu19-167\r\n1=180, 2=180\r\n3=200, 4=180\r\n5=180, 6=180\r\n7=110, 8=150\r\n9=170, 10=180\r\n11=110, 12=180", "totalbox": "1", "mini_01": 180, "mini_02": 180, "mini_03": 200, "mini_04": 180, "mini_05": 180, "mini_06": 180, "mini_07": 110, "mini_08": 150, "mini_09": 170, "mini_10": 180, "mini_11": 110, "mini_12": 180 }, { "sendercode": "PBL", "recipientname": "อายูรา เจ๊ะฮะ", "address": "195/1 ม.3 ต.มะรือโบออก อ.เจาะไอร้อง จ.นราธิวาส ", "postcode": "96130", "mobile": "0628822556", "contactperson": "อายูรา เจ๊ะฮะ", "phoneno": "0628822556", "remark": "Ayu19-169\r\nอายู 150 แท่ง\r\n3=30, 4=20\r\n6=10, 8=20\r\n9=40, 10=10\r\n12=20", "totalbox": "1", "mini_03": 30, "mini_04": 20, "mini_06": 10, "mini_08": 20, "mini_09": 40, "mini_10": 10, "mini_12": 20 }, { "sendercode": "PBL", "recipientname": "คุณรวินทร์ พรมลิ", "address": "บริษัทเหรียญทองพาร์ทเซ็นเตอร์ \r\nอ่อนนุช66 แยก10 แขวงสวนหลวง เขตสวนหลวง กรุงเทพ  ", "postcode": "10250", "mobile": "0890658081", "contactperson": "คุณรวินทร์ พรมลิ", "phoneno": "0890658081", "codamount": 450, "remark": "แป้ง#01 ,ลิปใหญ่ #12", "totalbox": "1" }, { "sendercode": "PBL", "recipientname": "นส.เนตรประภา ทองคุ้ม", "address": "93 ม.11 ต.อ้อมน้อย อ.กระทุ่มแบน จ.สมุทรสาคร", "postcode": "74130", "mobile": "0853765727", "contactperson": "นส.เนตรประภา ทองคุ้ม", "phoneno": "0853765727", "remark": "9=5\r\n6=2\r\n10=1\r\nแป้งตลับชมพู เบอร์ 1 = 1", "totalbox": "1", "mini_06": 2, "mini_09": 5, "mini_10": 1 }, { "mini_01": 260, "mini_02": 259, "mini_03": 320, "mini_04": 289, "mini_05": 257, "mini_06": 260, "mini_07": 152, "mini_08": 238, "mini_09": 340, "mini_10": 241, "mini_11": 160, "mini_12": 281, "large_01": 0, "large_02": 0, "large_03": 0, "large_04": 0, "large_05": 0, "large_06": 0, "large_07": 0, "large_08": 0, "large_09": 0, "large_10": 0, "large_11": 0, "large_12": 0, "pub_01": 0, "pub_02": 0, "pub03": 0, "pb_01": 0, "pb_02": 0, "pb_03": 0, "soap_pink": 0, "soap_orange": 0 }] }
        mockup = {
            orderstatus: false,
            team_id: 'teamid',
            customer: {
                firstname: 'Nutshapon',
                lastname: 'Lertlaosakun',
                tel: '025337172',
                address: [
                    {
                        houseno: "55/7",
                        village: "casa-city",
                        street: "lumlukka Road",
                        subdistrict: "บึงคำพร้อย",
                        district: "lumlukka",
                        province: "phathumthani",
                        zipcode: "12150"
                    }
                ]
            },
            items: [
                {
                    name: 'ลิปติก',
                    option: [
                        {
                            name: 'สี',
                            value: [{
                                name: '#01',
                                qty: 2,
                            }],
                        }
                    ],
                    price: 100,
                    amount: 200
                }
            ],
            totalamount: 200,
            user_id: "user001",
            paymenttype:
            {
                name: "ปลายทาง"
            }
        };
        credentials = {
            username: 'username',
            password: 'password',
            firstname: 'first name',
            lastname: 'last name',
            email: 'test@email.com',
            roles: ['user']
        };
        token = jwt.sign(_.omit(credentials, 'password'), config.jwt.secret, {
            expiresIn: 2 * 60 * 60 * 1000
        });
        done();
    });

    it('should be Order get use token', (done) => {
        request(app)
            .get('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                done();
            });
    });

    it('should be Order get by id', function (done) {

        request(app)
            .post('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/orders/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        // console.log(resp);
                        assert.equal(resp.status, 200);
                        assert.notEqual(resp.data.orderno, "");
                        assert.equal(resp.data.customer.firstname, mockup.customer.firstname);
                        assert.equal(resp.data.customer.lastname, mockup.customer.lastname);
                        assert.equal(resp.data.customer.tel, mockup.customer.tel);
                        assert.equal(resp.data.items[0].name, mockup.items[0].name);
                        assert.equal(resp.data.items[0].option[0].name, mockup.items[0].option[0].name);
                        assert.equal(resp.data.items[0].option[0].value[0].name, mockup.items[0].option[0].value[0].name);
                        assert.equal(resp.data.items[0].option[0].value[0].qty, mockup.items[0].option[0].value[0].qty);
                        assert.equal(resp.data.items[0].price, mockup.items[0].price);
                        assert.equal(resp.data.items[0].amount, mockup.items[0].amount);
                        assert.equal(resp.data.totalamount, mockup.totalamount);
                        assert.equal(resp.data.user_id, mockup.user_id);
                        assert.equal(resp.data.paymenttype.name, mockup.paymenttype.name);
                        done();
                    });
            });

    });

    it('should be Order post use token', (done) => {
        request(app)
            .post('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.status, 200);
                assert.notEqual(resp.data.orderno, "");
                assert.equal(resp.data.customer.firstname, mockup.customer.firstname);
                assert.equal(resp.data.customer.lastname, mockup.customer.lastname);
                assert.equal(resp.data.customer.tel, mockup.customer.tel);
                assert.equal(resp.data.items[0].name, mockup.items[0].name);
                assert.equal(resp.data.items[0].option[0].name, mockup.items[0].option[0].name);
                assert.equal(resp.data.items[0].option[0].value[0].name, mockup.items[0].option[0].value[0].name);
                assert.equal(resp.data.items[0].option[0].value[0].qty, mockup.items[0].option[0].value[0].qty);
                assert.equal(resp.data.items[0].price, mockup.items[0].price);
                assert.equal(resp.data.items[0].amount, mockup.items[0].amount);
                assert.equal(resp.data.totalamount, mockup.totalamount);
                assert.equal(resp.data.user_id, mockup.user_id);
                assert.equal(resp.data.paymenttype.name, mockup.paymenttype.name);
                done();
            });
    });

    it('should be order put use token', function (done) {

        request(app)
            .post('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    orderno: 'orderno update'
                }
                request(app)
                    .put('/api/orders/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.notEqual(resp.data.orderno, "");
                        assert.equal(resp.data.customer.firstname, mockup.customer.firstname);
                        assert.equal(resp.data.customer.lastname, mockup.customer.lastname);
                        assert.equal(resp.data.customer.tel, mockup.customer.tel);
                        assert.equal(resp.data.items[0].name, mockup.items[0].name);
                        assert.equal(resp.data.items[0].option[0].name, mockup.items[0].option[0].name);
                        assert.equal(resp.data.items[0].option[0].value[0].name, mockup.items[0].option[0].value[0].name);
                        assert.equal(resp.data.items[0].option[0].value[0].qty, mockup.items[0].option[0].value[0].qty);
                        assert.equal(resp.data.items[0].price, mockup.items[0].price);
                        assert.equal(resp.data.items[0].amount, mockup.items[0].amount);
                        assert.equal(resp.data.totalamount, mockup.totalamount);
                        assert.equal(resp.data.paymenttype.name, mockup.paymenttype.name);
                        done();
                    });
            });

    });

    it('should be order delete use token', function (done) {

        request(app)
            .post('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/orders/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be order get not use token', (done) => {
        request(app)
            .get('/api/orders')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    it('should be order post not use token', function (done) {

        request(app)
            .post('/api/orders')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be order put not use token', function (done) {

        request(app)
            .post('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    orderno: 'orderno update'
                }
                request(app)
                    .put('/api/orders/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be order delete not use token', function (done) {

        request(app)
            .post('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/orders/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('this should get order by user_id', function (done) {
        request(app)
            .post('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;

                var user_id = {
                    user_id: 'user001'
                }
                request(app)
                    .get('/api/order/user/' + user_id.user_id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.notEqual(resp.data[0].orderno, "");
                        assert.equal(resp.data[0].customer.firstname, mockup.customer.firstname);
                        assert.equal(resp.data[0].customer.lastname, mockup.customer.lastname);
                        assert.equal(resp.data[0].customer.tel, mockup.customer.tel);
                        assert.equal(resp.data[0].items[0].name, mockup.items[0].name);
                        assert.equal(resp.data[0].items[0].option[0].name, mockup.items[0].option[0].name);
                        // assert.equal(resp.data[0].items[0].option[0].value, mockup.items[0].option[0].value);
                        // assert.equal(resp.data[0].items[0].option[0].qty, mockup.items[0].option[0].qty);
                        assert.equal(resp.data[0].items[0].price, mockup.items[0].price);
                        assert.equal(resp.data[0].items[0].amount, mockup.items[0].amount);
                        assert.equal(resp.data[0].totalamount, mockup.totalamount);
                        assert.equal(resp.data[0].user_id, user_id.user_id);
                        assert.equal(resp.data[0].paymenttype.name, mockup.paymenttype.name);
                        done();
                    })
            })
    });

    it('this should get order by team', function (done) {
        var order1 = new Order({
            team_id: 'aaa',
            customer: {
                firstname: 'Nutshapon',
                lastname: 'Lertlaosakun',
                tel: '025337172',
                address: [
                    {
                        houseno: "55/7",
                        village: "casa-city",
                        street: "lumlukka Road",
                        subdistrict: "บึงคำพร้อย",
                        district: "lumlukka",
                        province: "phathumthani",
                        zipcode: "12150"
                    }
                ]
            },
            items: [
                {
                    name: 'ลิปติก',
                    option: [
                        {
                            name: 'สี',
                            value: [{
                                name: '#01',
                                qty: 2,
                            }],
                        }
                    ],
                    price: 100,
                    amount: 200
                }
            ],
            totalamount: 200,
            user_id: "user001",
            paymenttype:
            {
                name: "ปลายทาง"
            }

        });
        var order2 = new Order({
            team_id: 'aaa',
            customer: {
                firstname: 'ponlawath',
                lastname: 'changkeb',
                tel: '0553568978',
                address: [
                    {
                        houseno: "55/7",
                        village: "casa-city",
                        street: "lumlukka Road",
                        subdistrict: "บึงคำพร้อย",
                        district: "lumlukka",
                        province: "phathumthani",
                        zipcode: "12150"
                    }
                ]
            },
            items: [
                {
                    name: 'แป้ง',
                    option: [
                        {
                            name: 'สี',
                            value: [{
                                name: '#01',
                                qty: 2,
                            }],
                        }
                    ],
                    price: 70,
                    amount: 50
                }
            ],
            totalamount: 280,
            user_id: "user002",
            paymenttype:
            {
                name: "ปลายทาง"
            }

        })
        var order3 = new Order({
            team_id: 'aaa',
            customer: {
                firstname: 'nutnut',
                lastname: 'lertlao',
                tel: '05359876',
                address: [
                    {
                        houseno: "55/7",
                        village: "casa-city",
                        street: "lumlukka Road",
                        subdistrict: "บึงคำพร้อย",
                        district: "lumlukka",
                        province: "phathumthani",
                        zipcode: "12150"
                    }
                ]
            },
            items: [
                {
                    name: 'ลิปติก',
                    option: [
                        {
                            name: 'สี',
                            value: [{
                                name: '#01',
                                qty: 2,
                            }],

                        }
                    ],
                    price: 100,
                    amount: 150
                }
            ],
            totalamount: 500,
            user_id: "user003",
            paymenttype:
            {
                name: "ปลายทาง"
            }

        })

        order1.save(function (err, ord1) {
            order2.save(function (err, ord2) {
                order3.save(function (err, ord3) {
                    if (err) {
                        return done(err)
                    }
                    var idteam = 'aaa'
                    request(app)
                        .get('/api/order/team/' + idteam)
                        .set('Authorization', 'Bearer ' + token)
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                return done(err);
                            }
                            var resp = res.body;
                            // console.log(resp);
                            assert.equal(resp.data[0].user_id, order1.user_id)
                            assert.equal(resp.data[0].totalamount, order1.totalamount)
                            assert.equal(resp.data[0].paymenttype.name, order1.paymenttype.name)
                            assert.equal(resp.data[0].customer.firstname, order1.customer.firstname)
                            assert.equal(resp.data[0].customer.lastname, order1.customer.lastname)
                            assert.equal(resp.data[0].customer.tel, order1.customer.tel)
                            assert.equal(resp.data[0].customer.address[0].houseno, order1.customer.address[0].houseno)
                            assert.equal(resp.data[0].items[0].name, order1.items[0].name)
                            // assert.equal(resp.data[0].items[0].option[0].qty, order1.items[0].option[0].qty)
                            assert.equal(resp.data[0].items[0].price, order1.items[0].price)
                            assert.equal(resp.data[0].items[0].amount, order1.items[0].amount)
                            assert.equal(resp.data[1].user_id, order2.user_id)
                            assert.equal(resp.data[1].totalamount, order2.totalamount)
                            assert.equal(resp.data[1].paymenttype.name, order1.paymenttype.name)
                            assert.equal(resp.data[1].customer.firstname, order2.customer.firstname)
                            assert.equal(resp.data[1].customer.lastname, order2.customer.lastname)
                            assert.equal(resp.data[1].customer.tel, order2.customer.tel)
                            assert.equal(resp.data[1].customer.address[0].houseno, order2.customer.address[0].houseno)
                            assert.equal(resp.data[1].items[0].name, order2.items[0].name)
                            // assert.equal(resp.data[1].items[0].option[0].qty, order3.items[0].option[0].qty)
                            assert.equal(resp.data[1].items[0].price, order2.items[0].price)
                            assert.equal(resp.data[1].items[0].amount, order2.items[0].amount)

                            done();
                        });
                })
            })
        })
    });

    it('should be owner send order', function (done) {

        var order1 = new Order({
            team_id: 'teamid',
            customer: {
                firstname: 'Nutshapon',
                lastname: 'Lertlaosakun',
                tel: '025337172',
                address: [
                    {
                        houseno: "55/7",
                        village: "casa-city",
                        street: "lumlukka Road",
                        subdistrict: "บึงคำพร้อย",
                        district: "lumlukka",
                        province: "phathumthani",
                        zipcode: "12150"
                    }
                ]
            },
            items: [
                {
                    name: 'ลิปติก',
                    option: [
                        {
                            name: 'สี',
                            value: [{
                                name: '#01',
                                qty: 2,
                            }],
                        }
                    ],
                    price: 100,
                    amount: 200
                }
            ],
            totalamount: 200,
            user_id: "user001",
            paymenttype:
            {
                name: "ปลายทาง"
            }

        });
        order1.save(function () {
            request(app)
                .post('/api/orders')
                .set('Authorization', 'Bearer ' + token)
                .send(mockup)
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    var resp = res.body;
                    // console.log(resp.data)
                    var update = {
                        orderstatus: true
                    }
                    request(app)
                        .put('/api/order/sendorder/' + resp.data.team_id)
                        .set('Authorization', 'Bearer ' + token)
                        .send(update)
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                return done(err);
                            }
                            var resp = res.body;

                            done();
                        });
                });
        })


    });

    it('should be Order Get Order History ', function (done) {

        request(app)
            .post('/api/orders')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/order/history/' + resp.data.user_id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        // console.log(resp);
                        // assert.equal(resp.data.)
                        done();
                    });
            });

    });

    it('should be Import Orders use token', function (done) {
        request(app)
            .post('/api/order/import')
            .set('Authorization', 'Bearer ' + token)
            .send(importMock)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.status, 200);
                assert.equal(resp.data.length, 27);
                done();
                // request(app)
                //     .get('/api/orders')
                //     .set('Authorization', 'Bearer ' + token)
                //     .expect(200)
                //     .end((err, res) => {
                //         if (err) {
                //             return done(err);
                //         }
                //         var resp = res.body;
                //         assert.equal(resp.status, 200);
                //         assert.equal(resp.data.filename, importMock.filename);
                //         done();
                //     });
            });
    })


    afterEach(function (done) {
        Order.remove().exec(done);
    });

});