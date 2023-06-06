SET REFERENTIAL_INTEGRITY FALSE; -- 모든 제약 조건 비활성화
truncate table account;
truncate table account_image;
truncate table board;
truncate table board_image;
truncate table comment;
truncate table complaint;
truncate table liky;
truncate table medication_history;
truncate table pet;
truncate table pet_image;
truncate table surgery_history;
truncate table vaccination_history;
SET REFERENTIAL_INTEGRITY TRUE; -- 모든 제약 조건 활성화
