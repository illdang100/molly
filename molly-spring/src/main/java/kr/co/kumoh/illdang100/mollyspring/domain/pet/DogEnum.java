package kr.co.kumoh.illdang100.mollyspring.domain.pet;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum DogEnum {

    // 소형견
    MALTESE("말티즈"),
    POMERANIAN("포메라니안"),
    FRENCH_BULLDOG("프렌치 불도그"),
    CHIHUAHUA("치와와"),
    BEAGLE("비글"),
    YORKSHIRE_TERRIER("요크셔 테리어"),
    DACHSHUND("닥스훈트"),
    PUG("퍼그"),
    SHIHTZU("시츄"),
    TERRIER_DOG("테리어견"),
    SPITZ("스피츠"),
    JAPANESE_SPITZ("일본 스피츠"),
    GERMAN_SPITZ("독일 스피츠"),
    POODLE("푸들"),
    SHIBAINU("시바견"),
    AKITAINU("아키타견"),
    SCHIPPERKEY("스키퍼키"),
    ENGLISH_COCKER_SPANIEL("잉글리시 코커 스패니얼"),
    LHASAAPSO("라사압소"),
    BOXER("복서"),
    DALMATIAN("달마티안"),
    MINIATURE_PINSCHER("미니어처 핀셔"),
    BRUSSELSGRIFFON("브뤼셀 그리펀"),
    LEKENOA("레케노아"),
    TERVUREN("테뷰런"),
    JACK_RUSSELL_TERRIER("잭 러셀 테리어"),
    AUSTRALIAN_SILKY_TERRIER("오스트레일리안 실키 테리어"),
    PUNGSAN_DOG("풍산개"),
    SAPSAREE("삽살개"),
    UTILITY_DOG("실용견"),
    BOSTON_TERRIER("보스턴 테리어"),
    TIBETAN_TERRIER("티베탄 테리어"),
    TOY_POODLE("토이 푸들"),
    MINIATURE_SCHNAUZER("미니어처 슈나우저"),

    // 중형견
    BICHON_FRIZE("비숑프리제"),
    BORDER_COLLIE("보더콜리"),
    SAMOYED("사모예드"),
    WELSH_CORGI("웰시코기"),
    JINDO_DOG("진돗개"),
    CHOW_CHOW("차우차우"),
    SIBERIAN_HUSKY("시베리안 허스키"),
    BULL_TERRIER("불 테리어"),
    GREAT_PYRENEES("그레이트 피레니즈"),
    PIT_BULL_TERRIER("핏불 테리어"),

    //대형견
    LABRADOR_RETRIEVER("래브라도 리트리버"),
    GERMAN_SHEPHERD("저먼 셰퍼드"),
    GOLDEN_RETRIEVER("골든 리트리버"),
    TIBETAN_MASTIFF("티베탄 마스티프"),
    CHESAPEAKE_BAY_RETRIEVER("체서피크 베이 리트리버"),
    FLAT_COATED_RETRIEVER("플랫 코티드 리트리버"),
    CURLY_COATED_RETRIEVER("컬리 코티드 리트리버"),
    TOSA_DOG("도사견"),
    BLOODHOUND("블러드하운드"),
    BULLMASTIFF("불마스티프"),
    MASTIFF("마스티프"),
    MALINOIS("말리노이즈"),
    BELGIAN_TEN_DOG("벨지안 십도그"),
    DOBERMAN_PINSCHER("도베르만 핀셔"),
    GIANT_POODLE("자이언트 푸들"),
    KANGAL("캉갈"),
    GREYHOUND("그레이 하운드"),
    GRATE_DANE("그레이트 데인");

    private String value;
}
