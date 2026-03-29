INSERT INTO MYAPP.ORDERS (ORDER_ID,USER_ID,TOTAL_AMOUNT,VAT_AMOUNT,STATUS,SHIPPING_ADDRESS_NAME,SHIPPING_FULL_ADDRESS,TAX_IDENTIFICATION_NUMBER,CREATED_AT) VALUES
	 (1,2,500,35,'Processing','Office',TO_CLOB('789 Office Bangkok 10300'),NULL,TIMESTAMP'2026-03-28 22:49:00.011'),
	 (2,2,26500,1855,'Processing','Home',TO_CLOB('456 Customer Road Bangkok 10200'),'1234567890123',TIMESTAMP'2026-03-28 22:49:01.944'),
	 (28,1,1284,84,'Pending','123 Sukhumvit Road, Watthana, Bangkok 10110',TO_CLOB('123 Sukhumvit Road, Watthana, Bangkok 10110'),NULL,TIMESTAMP'2026-03-29 21:35:08.739'),
	 (32,1,1284,84,'Pending','123 Sukhumvit Road, Watthana, Bangkok 10110',TO_CLOB('123 Sukhumvit Road, Watthana, Bangkok 10110'),NULL,TIMESTAMP'2026-03-29 21:38:45.828'),
	 (33,1,1284,84,'Pending','123 Sukhumvit Road, Watthana, Bangkok 10110',TO_CLOB('123 Sukhumvit Road, Watthana, Bangkok 10110'),NULL,TIMESTAMP'2026-03-29 21:39:39.572'),
	 (34,1,1284,84,'Pending','123 Sukhumvit Road, Watthana, Bangkok 10110',TO_CLOB('123 Sukhumvit Road, Watthana, Bangkok 10110'),NULL,TIMESTAMP'2026-03-29 21:40:44.257'),
	 (35,1,263483.22,17237.22,'Pending','123 Sukhumvit Road, Watthana, Bangkok 10110',TO_CLOB('123 Sukhumvit Road, Watthana, Bangkok 10110'),NULL,TIMESTAMP'2026-03-29 21:41:06.757'),
	 (36,1,263483.22,17237.22,'Pending','123 Sukhumvit Road, Watthana, Bangkok 10110',TO_CLOB('123 Sukhumvit Road, Watthana, Bangkok 10110'),NULL,TIMESTAMP'2026-03-29 21:41:11.012'),
	 (37,1,131741.61,8618.61,'Pending','123 Sukhumvit Road, Watthana, Bangkok 10110',TO_CLOB('123 Sukhumvit Road, Watthana, Bangkok 10110'),NULL,TIMESTAMP'2026-03-29 21:41:23.26'),
	 (38,1,1284,84,'Processing','123 Sukhumvit Road, Watthana, Bangkok 10110',TO_CLOB('123 Sukhumvit Road, Watthana, Bangkok 10110'),NULL,TIMESTAMP'2026-03-29 21:42:00.037');
INSERT INTO MYAPP.ORDERS (ORDER_ID,USER_ID,TOTAL_AMOUNT,VAT_AMOUNT,STATUS,SHIPPING_ADDRESS_NAME,SHIPPING_FULL_ADDRESS,TAX_IDENTIFICATION_NUMBER,CREATED_AT) VALUES
	 (39,1,26750,1750,'Pending','123 Sukhumvit Road, Watthana, Bangkok 10110',TO_CLOB('123 Sukhumvit Road, Watthana, Bangkok 10110'),NULL,TIMESTAMP'2026-03-29 21:48:28.425'),
	 (40,1,26750,1750,'Pending','123 Sukhumvit Road, Watthana, Bangkok 10110',TO_CLOB('123 Sukhumvit Road, Watthana, Bangkok 10110'),NULL,TIMESTAMP'2026-03-29 21:50:12.69'),
	 (41,1,26750,1750,'Shipped','123 Sukhumvit Road, Watthana, Bangkok 10110',TO_CLOB('123 Sukhumvit Road, Watthana, Bangkok 10110'),NULL,TIMESTAMP'2026-03-29 21:50:19.725');
