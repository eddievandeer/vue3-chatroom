SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for chat_friend
-- ----------------------------
DROP TABLE IF EXISTS `chat_friend`;
CREATE TABLE `chat_friend` (
  `user_id` int NOT NULL,
  `friend_id` int NOT NULL,
  `add_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
  KEY `user_id` (`user_id`),
  KEY `friend_id` (`friend_id`),
  CONSTRAINT `friend_id` FOREIGN KEY (`friend_id`) REFERENCES `chat_user` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `chat_user` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for chat_msg
-- ----------------------------
DROP TABLE IF EXISTS `chat_msg`;
CREATE TABLE `chat_msg` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `message` varchar(150) DEFAULT NULL,
  `from_uid` int NOT NULL,
  `to_uid` int NOT NULL,
  `send_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`message_id`),
  KEY `from` (`from_uid`),
  KEY `to` (`to_uid`),
  CONSTRAINT `from` FOREIGN KEY (`from_uid`) REFERENCES `chat_user` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `to` FOREIGN KEY (`to_uid`) REFERENCES `chat_user` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for chat_user
-- ----------------------------
DROP TABLE IF EXISTS `chat_user`;
CREATE TABLE `chat_user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nickname` varchar(25) NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'http://upyun.cavalheiro.cn/images/avatar.png',
  `signature` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '系统原装签名，送给每一位小可爱',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10009 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- View structure for chat_friend_detail
-- ----------------------------
DROP VIEW IF EXISTS `chat_friend_detail`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `chat_friend_detail` AS select `chat_friend`.`user_id` AS `user_id`,`chat_friend`.`friend_id` AS `friend_id`,`chat_user`.`username` AS `username`,`chat_user`.`avatar` AS `avatar`,`chat_friend`.`add_date` AS `add_date`,`chat_user`.`nickname` AS `nickname`,`chat_user`.`signature` AS `signature` from (`chat_friend` join `chat_user`) where (`chat_friend`.`friend_id` = `chat_user`.`user_id`) ;

-- ----------------------------
-- View structure for chat_msg_detail
-- ----------------------------
DROP VIEW IF EXISTS `chat_msg_detail`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `chat_msg_detail` AS select `chat_msg`.`from_uid` AS `from_uid`,`chat_msg`.`to_uid` AS `to_uid`,`chat_msg`.`message` AS `message`,`chat_user`.`avatar` AS `avatar`,`chat_msg`.`send_time` AS `send_time` from (`chat_msg` join `chat_user`) where (`chat_msg`.`from_uid` = `chat_user`.`user_id`) ;
