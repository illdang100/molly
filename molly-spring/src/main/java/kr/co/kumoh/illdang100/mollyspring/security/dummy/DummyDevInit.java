package kr.co.kumoh.illdang100.mollyspring.security.dummy;

import kr.co.kumoh.illdang100.mollyspring.domain.account.Account;
import kr.co.kumoh.illdang100.mollyspring.domain.account.AccountEnum;
import kr.co.kumoh.illdang100.mollyspring.domain.board.Board;
import kr.co.kumoh.illdang100.mollyspring.domain.board.BoardEnum;
import kr.co.kumoh.illdang100.mollyspring.domain.image.ImageFile;
import kr.co.kumoh.illdang100.mollyspring.domain.pet.PetTypeEnum;
import kr.co.kumoh.illdang100.mollyspring.repository.account.AccountRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.board.BoardRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.comment.CommentRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.liky.LikyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@Configuration
@RequiredArgsConstructor
public class DummyDevInit extends DummyObject {

    private final BCryptPasswordEncoder passwordEncoder;

    @Value("${admin.name}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.nickname}")
    private String adminNickname;

    @Profile("dev") // prod 모드에서는 실행되면 안된다.
    @Bean
    CommandLineRunner init(AccountRepository accountRepository, BoardRepository boardRepository,
                           CommentRepository commentRepository, LikyRepository likyRepository) {
        return (args) -> {
            // 서버 실행시 무조건 실행된다.

            Account admin = accountRepository.save(Account.builder()
                    .id(1L)
                    .username(adminUsername)
                    .password(passwordEncoder.encode(adminPassword))
                    .email(adminEmail)
                    .role(AccountEnum.ADMIN)
                    .nickname(adminNickname)
                    .build());

            /*Board adminBoard1 = boardRepository.save(newBoard(admin, "강아지 필수 예방 접종의 시기와 종류, 순서까지", "<figure class=\"image\"><img src=\"https://www.fitpetmall.com/wp-content/uploads/2022/11/Frame-9-6-768x768.jpg\" alt=\"강아지 필수 예방 접종\" srcset=\"https://www.fitpetmall.com/wp-content/uploads/2022/11/Frame-9-6-768x768.jpg 768w, https://www.fitpetmall.com/wp-content/uploads/2022/11/Frame-9-6-300x300.jpg 300w, https://www.fitpetmall.com/wp-content/uploads/2022/11/Frame-9-6-1024x1024.jpg 1024w, https://www.fitpetmall.com/wp-content/uploads/2022/11/Frame-9-6-150x150.jpg 150w, https://www.fitpetmall.com/wp-content/uploads/2022/11/Frame-9-6.jpg 1125w\" sizes=\"100vw\" width=\"500\"></figure><p>강아지의 성장 단계에 맞춰 꼭 실시해야 하는 강아지 필수 예방 접종! 반려견을 처음 가족으로 맞이하는 초보 반려인이라면 반드시 정확히 알고 있어야 합니다.</p><p>이번 글에서는 강아지 필수 예방 접종 시기, 종류, 순서, 비용을 알려드릴게요.</p><h2><strong>강아지 필수 예방 접종 시기</strong></h2><p>강아지 필수 예방 접종은 생후 6주부터 16주까지 <strong>2주 간격으로 총 6회 실시</strong>합니다. 이후 심장 사상충과 외부 기생충 예방 접종을 월 1회 진행하는 것을 권장합니다.</p><h2><strong>강아지 예방 접종 종류</strong></h2><ul><li>DHPPL(종합 백신) : 홍역, 바이러스성 간염, 파보 장염 등 강아지에게 자주 발생하고 사망률이 높은 질환을 종합적으로 예방</li><li>코로나 장염 백신 : 코로나 바이러스에 의해 유발되는 장염, 구토, 발열, 설사 등을 예방</li><li>켄넬 코프 백신 : 전염성이 강한 기관지염으로 기침, 발열, 콧물 등의 증상을 예방</li><li>신종 플루 백신 : 전염성이 강한 신종 플루 바이러스(H3N2)에 의해 유발되는 호흡기 질환을 예방</li><li>광견병 백신 : 중추신경계에 침입하여 죽음에 이르게 하는 전염병을 예방</li><li>심장 사상충 백신 : 기생충의 일종인 심장 사상충이 ‘모기’에 의해 감염되어 심장에 기생하며 혈관을 막는 질환 예방</li><li>외부 기생충 백신 : 진드기, 벼룩 등의 외부 기생충에 의한 감염을 예방</li></ul><h2><strong>강아지 예방 접종 순서</strong></h2><p><strong>1차 접종</strong> (생후 6주) : DHPPL 1차 + 코로나 장염 1차</p><p><strong>2차 접종</strong> (생후 8주) : DHPPL 2차 + 코로나 장염 2차</p><p><strong>3차 접종</strong> (생후 10주) : DHPPL 3차 + 켄넬 코프 1차</p><p><strong>4차 접종</strong> (생후 12주) : DHPPL 4차 + 켄넬 코프 2차</p><p><strong>5차 접종</strong> (생후 14주) : DHPPL 5차 + 신종 플루 1차</p><p><strong>6차 접종</strong>(생후 16주) : 신종 플루 2차 + 광견병 예방 접종</p><h2><strong>강아지 예방 접종 비용</strong></h2><p>강아지 필수 예방 접종 비용은 백신의 종류에 따라 달라요. 필수 예방 접종을 모두 진행하면 약 10만 원 정도의 비용이 발생하니 참고해 주세요.</p><figure class=\"table\"><table><tbody><tr><td><strong>백신 종류</strong></td><td><strong>예방 접종 비용</strong></td></tr><tr><td>DHPPL 종합 백신</td><td>25,000원</td></tr><tr><td>코로나 장염 백신</td><td>15,000원</td></tr><tr><td>켄넬 코프 백신</td><td>15,000원</td></tr><tr><td>신종 플루 백신</td><td>30,000원</td></tr><tr><td>광견병 백신</td><td>20,000원</td></tr></tbody></table></figure><p>이번 글에서는 강아지 예방 접종에 꼭 필요한 정보인 접종 시기부터 비용까지 확인해 봤어요.<br>반려인이 예방 접종과 질환에 대해 정확하게 알아야 우리 아이의 건강을 지킬 수 있다는 점 잊지 마세요!</p>",
                    BoardEnum.MEDICAL, PetTypeEnum.DOG, true));

            Board adminBoard2 = boardRepository.save(newBoard(admin, "커뮤니티 사용자들을 위한 중요 안내사항", "<p>안녕하세요, 모든 커뮤니티 사용자 여러분!</p><p>저희 반려동물 예방접종 및 건강 정보 관리 웹 서비스 커뮤니티에 오신 것을 환영합니다.&nbsp;</p><p>여기서는 모두가 즐겁고 유익한 경험을 공유하기 위해 몇 가지 중요한 안내사항을 공유드리고자 합니다.</p><p>&nbsp;</p><p><strong>1. 예의와 존중</strong>&nbsp;</p><p>커뮤니티 내에서는 항상 다른 사용자들에 대한 예의와 존중을 지켜주세요.&nbsp;</p><p>서로를 존중하며 공손한 언어를 사용해주시고, 다른 의견에 대해서는 건설적인 토론을 진행해 주시기 바랍니다.</p><p>&nbsp;</p><p><strong>2. 허위 정보와 불법 활동 금지</strong></p><p>커뮤니티에서는 허위 정보를 게시하거나 불법 활동을 수행하는 것이 엄격히 금지됩니다.&nbsp;</p><p>우리는 신뢰성과 정확성을 중요하게 여기며, 모두가 안전하게 정보를 교류할 수 있는 환경을 유지하고자 합니다.</p><p>&nbsp;</p><p><strong>3. 개인정보 보호</strong></p><p>개인정보 보호는 저희에게 매우 중요한 사안입니다.&nbsp;</p><p>커뮤니티에서는 다른 사용자들의 개인정보를 요구하거나 공유하지 않도록 주의해주시기 바랍니다.&nbsp;</p><p>또한, 본인의 개인정보를 적절하게 보호해 주세요.</p><p>&nbsp;</p><p><strong>4. 적절한 주제와 게시물</strong></p><p>커뮤니티 내에서는 우리 웹 서비스의 주요 주제인 반려동물 예방접종과 건강 정보에 집중하여 토론 및 게시물을 작성해 주시기 바랍니다.&nbsp;</p><p>주제와 관련이 없거나 적합하지 않은 게시물은 삭제될 수 있음을 유념해 주세요.</p><p>&nbsp;</p><p>위의 안내사항은 모든 사용자들이 웹 서비스를 안전하고 유익하게 이용할 수 있도록 지켜야 할 중요한 지침입니다. 모두가 함께 즐거운 커뮤니티 활동을 할 수 있도록 협력해 주시기 바랍니다.</p><p>감사합니다! 반려동물 예방접종 및 건강 정보 관리 웹 서비스 관리자 드림</p>",
                    BoardEnum.MEDICAL, PetTypeEnum.DOG, true));

            *//*ImageFile jjangguProfile = new ImageFile("jjangguUploadFileName", "jjangguStoreFileName", "https://pds.joins.com/service/ssully/pd/2022/07/01/2022070116570979121.jpg");
            Account jjanggu = accountRepository.save(newAccount("kakao_1234", "짱구", jjangguProfile));

            ImageFile yuliProfile = new ImageFile("yuliUploadFileName", "yuliStoreFileName", "https://mblogthumb-phinf.pstatic.net/MjAxNzEwMDFfMTQ0/MDAxNTA2NzkyMTQ5NDMy.qAH1f3-XmYpVWW-LEonjEln3YV8kH-G3HGYVeIiXqOwg.eYbZ-AbjGqQekYOOWyysjy5Rm40Sr6Hd2oewY42dtAMg.JPEG.donghyun0436/Screenshot_2017-10-01-02-08-34.jpg?type=w800");
            Account yuli = accountRepository.save(newAccount("kakao_5678", "유리", yuliProfile));

            ImageFile cheolsuProfile = new ImageFile("cheolsuUploadFileName", "cheolsuStoreFileName", "https://mblogthumb-phinf.pstatic.net/MjAyMTA3MTlfMTI4/MDAxNjI2Njc1Nzk5MjQx.Jdt65wA9qlW4bO2bq69d8gOG3WjQyNJYeB-AJyeEFOog.Wy8UbOseSEZvvoo52b1_zw1-IPpNCbgBZn8uHXXoSQQg.JPEG.xdbxdbx/1626443425770.jpg?type=w800");
            Account cheolsu = accountRepository.save(newAccount("kakao_9101", "철수", cheolsuProfile));

            ImageFile maengguProfile = new ImageFile("maengguUploadFileName", "maengguStoreFileName", "https://mblogthumb-phinf.pstatic.net/MjAyMTA3MTlfMTYx/MDAxNjI2Njc1ODAwOTU0.ky2VUP-slXlWLSS-HPMkYmM5XiLANMUAzRcnNeYnOlkg.NOFjSu8jcSNNaBzwRnbTIwPvmUOPUH7lpRogX76tt3kg.JPEG.xdbxdbx/1626443468254.jpg?type=w800");
            Account maenggu = accountRepository.save(newAccount("kakao_9999", "맹구", maengguProfile));
*//*
            Board jjangguBoard2 = boardRepository.save(newBoard(jjanggu, "반려동물 예방접종 일정 공유합니다!", "<p>안녕하세요, 여러분!&nbsp;</p><p>제 반려견 루키의 예방접종 일정을 공유하려 합니다.&nbsp;</p><p>광견병 예방접종은 7월 15일에 ABC 동물병원에서 받을 예정입니다.&nbsp;</p><p>같은 날에 접종을 받으실 분 계신가요?&nbsp;</p><p>함께 기다리는 시간에 대해 이야기해봐요!</p>",
                    BoardEnum.FREE, PetTypeEnum.NOT_SELECTED, false));
            Board maengguBoard = boardRepository.save(newBoard(maenggu, "고양이 치료 관련 질문입니다!", "<p>안녕하세요, 고양이를 키우고 있는데 최근에 이상한 증상이 나타나서 걱정입니다.&nbsp;</p><p>토를 많이 하고 약간의 식욕 감퇴가 있는데, 이럴 때 병원 방문이 필요한 건가요?&nbsp;</p><p>비슷한 경험이 있는 분들이 계시다면 조언 부탁드립니다!</p>",
                    BoardEnum.MEDICAL, PetTypeEnum.CAT, false));
            Board cheolsuBoard = boardRepository.save(newBoard(cheolsu, "반려동물 명예의 전당! 사랑하는 우리 아이들 사진 공유해주세요!", "<p>여기에 있는 모든 반려동물들이 정말 귀여워요!&nbsp;</p><p>저도 저희 강아지 볼티의 사진을 공유하려고 합니다.&nbsp;</p><p>볼티는 작년에 저희 가족에 합류했는데, 정말 사랑스럽고 활발한 아이에요.&nbsp;</p><p>여러분의 반려동물 사진도 함께 공유해주세요!</p><figure class=\"image\"><img src=\"https://kit-molly-bucket.s3.ap-northeast-2.amazonaws.com/board/1/ddbc56a2-31ba-41ae-a21f-b4a01d4fca95image.jpeg\" alt=\"윙크하는 강아지 : 동아사이언스\"></figure>",
                    BoardEnum.FREE, PetTypeEnum.NOT_SELECTED, false));

            Board jjangguBoard1 = boardRepository.save(newBoard(jjanggu, "[질문] 강아지 키울때 주의할 점 어떤게 있을까요?", "<p>안녕하세요. 제가 곧 강아지를 분양받는데요.&nbsp;</p><p>강아지를 한번도 키워본 적이 없어서 도움을 받고자 합니다..!&nbsp;</p><p>강아지를 키울때 주의하면서 키워야 되는 점이 있나요..?&nbsp;</p><p>여기서도 궁금한점 한번 여쭙고 싶네용</p>",
                    BoardEnum.FREE, PetTypeEnum.DOG, false));

            Board yuliBoard = boardRepository.save(newBoard(yuli, "애완 토끼 키우기! 분양, 사육 방법, 준비물", "<p>토끼는 강아지나 고양이처럼 애완용으로 키우는 경우가 많지 않아, 토끼의 사육정보에 대해 잘 모르는 분들이 많을거라 생각합니다. 토끼를 키우고 싶어하는 분들을 위해 토끼의 특성이나 사육방법, 주의사항 등에 대해 알려드리겠습니다. 토끼 분양에 생각이 있으신 분들은 꼭 참고하시길 바랍니다.&nbsp;</p><p>&nbsp;</p><figure class=\"image\"><img src=\"https://blog.kakaocdn.net/dn/DxqzC/btq5Q9q1Bfm/tPWCcZUK4nnK8K6Fa0PSP0/img.png\" srcset=\"https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&amp;fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FDxqzC%2Fbtq5Q9q1Bfm%2FtPWCcZUK4nnK8K6Fa0PSP0%2Fimg.png\" sizes=\"100vw\"></figure><p>&nbsp;</p><h3>정기적인 케어</h3><p>개나 고양이에 비하면 비교적 쉽게 기를 수 있지만, 주기적으로 케어해야 할 부분이 있습니다.<br><br><strong>· 매일</strong><br>식사(1일 2회), 물교체, 화장실 청소, 케이지(집) 청소, 운동(케이지에서 꺼내기), 칫솔질, 건강 체크</p><p><br><strong>· 매월</strong><br>손톱깎이(1~2개월 단위), 식기 세척</p><p><br><strong>· 매년</strong><br>동물병원에서 건강검진</p><h3><br>토끼 사육시 생활주기</h3><p>토끼를 기르기 시작하면 케어를 위한 생활주기가 필요합니다. 낮에 일하느라 집을 비우는 경우가 많은 분들을 기준으로 정해보았습니다. 식사는 가능한 같은 시간에 주는 것이 바람직하며, 식사 이외에는 상황에 맞게 변경할 수 있습니다.<br><br><strong>· 아침</strong><br>조식,&nbsp;물&nbsp;교환</p><p><br><strong>· 주간</strong><br>주인이 귀가할 때까지 토끼는 케이지 안에서 한가로이 시간을 보냅니다.</p><p><br><strong>· 밤</strong><br>석식, 운동, 화장실 청소, 케이지 청소, 칫솔질, 건강체크.</p><p><br><strong>· 심야</strong><br>취침 전 케이지에 넣고, 주인이 기상할 때까지 케이지에서 보냅니다.</p><p>&nbsp;</p><h3><br>적정 온도·습도</h3><p>토끼는 추위에 강하고 더위에 약한 동물입니다. 토끼가 쾌적하게 지낼 수 있는 적정 기온은 16℃~22℃, 적정 습도는 40%~60%입니다. 그러나 적정 온도, 적정 습도를 벗어났다고 몸 상태가 금방 나빠지는 일은 없습니다. 젊고 건강한 토끼의 경우 섭씨 10도~24도 범위 안에서라면 문제는 별로 일어나지 않는다고 봅니다. 또한 아주 어린 토끼나 늙은 토끼, 질병에 걸린 토끼는 더위와 추위에 대한 저항력이 약하기 때문에 충분한 주의가 필요합니다.</p><p>&nbsp;</p><h3><br>사육&nbsp;환경</h3><p>최근에는 실내사육이 주류이며 정원이나 베란다에서 사육 할 수 있지만, 더위나 추위, 탈주, 외부 침입 등 고려할 것이 많기 때문에 추천 할 수 없습니다. 실내 사육을 할 때는 케이지를 놓을 위치, 운동할 장소가 필요합니다. 바닥에 놓인 물건이나 케이블 등을 갉아먹을 우려가 있으므로 정리,정돈에 유의합니다. 케이지의 위치는 직사광선이 닿는 곳을 반드시 피하고 방문에서 가능한 멀리 떨어진 벽쪽이 기본입니다. 그러나 에어컨이나 창문의 위치도 고려해서 케이지의 위치를 정해주세요.<br><br>&nbsp;</p><h3>사육에 필요한 것</h3><p>토끼를 기를 때는 다양한 것이 필요합니다. 토끼를 맞이하기 전 먼저 필요한 것을 준비해두는 것이 좋습니다.</p><p>&nbsp;</p><p><strong>· 케이지</strong> : 토끼의 집으로, 토끼가 안심하고 지낼 수 있는 공간입니다. 집을 비울 때는 반드시 토끼를 케이지에 넣어주세요.</p><p><br><strong>· 캐리백 : </strong>이동용 가방입니다. 휴대용 가방으로 겉에서 보이지 않는 것부터, 케이지를 작게 만든 것 같은 캐리어도 있습니다. 처음 분양받을때 주로 캐리백에 넣어서 집까지 데리고 가며 병원에 갈때 등 이동할때 필요합니다.</p><p><br><strong>· 식기 : </strong>먹이나 보조식을 담기 위한 식기입니다. 입에&nbsp;물고&nbsp;뒤집는&nbsp;토끼도&nbsp;있기&nbsp;때문에&nbsp;고정식을&nbsp;추천합니다.</p><p><br><strong>· 급수기 : </strong>물을 접시로 줄 수도 있지만 위생면에서 좋지않아 보틀타입을 추천합니다. 물은&nbsp;남아있어도&nbsp;매일&nbsp;교체해주세요.<br>&nbsp;</p><p><strong>· 화장실</strong> : 토끼는 화장실을 기억하므로 가게에 있을 때와 같은 위치에 두면 빨리 기억해낼 수 있습니다. 화장실은&nbsp;매일&nbsp;청소해&nbsp;주세요.</p><p><br><strong>· 화장실 모래 : </strong>모래를 화장실에 깔아 사용합니다. 토끼의 경우 나무 부스러기를 굳힌 우드펠렛이 주류를 이루고 있습니다. 화장실 모래를 깔아줌으로써 화장실 오염을 방지하고 소변냄새를 줄입니다.</p><p><br><strong>· 갉는 나무 : </strong>토끼는 본능적으로 갉아먹는 것을 좋아합니다. 항상 하나는 케이지에 넣어주세요. 고정식 제품부터 굴려 사용하는 것까지 다양한 갉는 나무가 있습니다. 토끼가 좋아하는 갉는나무를 찾아가는 재미가 있습니다.</p><p><br><strong>· 칫솔 : </strong>정기적인 칫솔질은 필수입니다. 토끼와의 커뮤니케이션이 되기도 합니다. 용도에 따라 여러종류의 브러시가 있으며 처음에는 일반 칫솔질용을 준비합니다.</p><p><br>기본적으로 필요한 것들을 나열해 보았으며, 이외에도 써클(울타리), 온도·습도계, 손톱깍이, 각종 브러쉬, 탈취제, 리드줄 등이 있습니다.</p><p>&nbsp;</p><p>&nbsp;</p><h3>알레르기</h3><p>토끼를 기르기 시작하고 나서 토끼 알레르기, 목초 알레르기에 걸릴 수 있습니다. 알레르기에 걸리면 피부와 눈의 가려움증, 콧물과 재채기, 기침, 천식과 같은 증상이 나타날 수 있습니다. 만약 알레르기 증상이 나타났을 경우는 컨디션 관리를 제대로 하고 토끼방을 분리, 공기청정기 사용, 청소 자주하기, 목초를 가루가 적은 것으로 바꾸는 등 여러가지 대책을 세워야 합니다. 토끼를 놓아주는 일을 안이하게 생각하지 말고, 토끼를 키우기 전에 병원에서 알레르기 검사를 받으시길 바랍니다.</p><p>&nbsp;</p><h3><br>동물병원</h3><p>토끼를 진찰할 수 있는 동물병원을 미리 찾아 두는 것이 좋습니다. 개, 고양이는 애완동물의 수가 많기 때문에 비교적 어느 동물 병원에서나 진찰을 받을 수 있습니다. 그러나 토끼는 동물병원에 따라서 진찰을 받을 수 없는 경우도 있습니다.<br>작은 동물이나 새를 진찰해 주는 병원이 토끼도 잘 봐줄 가능성이 있다고 합니다. 응급상황시 생사를 가를 수도 있으므로 동물병원은 가까울 수록 좋습니다.<br><br>&nbsp;</p><p>&nbsp;</p><h3>다두 사육</h3><p>토끼를 처음 기르는 경우 여러마리를 기르는 것은 추천하지 않습니다. 성별의 차이나 궁합에 따라 함께 놀 수 없는 경우도 있으므로, 여러마리를 사육할 경우 별도의 케이지에 넣어주어야 합니다. 사육공간, 돌봄에 소요되는 시간이 증가하는 등의 문제도 생기므로 다두사육은 잘 생각해봐야 합니다.</p><p>&nbsp;</p><h3><br>인수 공통 감염증</h3><p>사람으로부터 동물, 동물로부터 사람으로 감염되는 병을 말합니다. 토끼의 경우 피부 사상균증, 파스퇴렐라증, 살모넬라증 등이 있습니다. 감염을 피하려면 토끼의 사육환경을 청결하게 유지하고, 농후한 접촉을 하지 않으며, 스킨십 후에는 손을 확실히 씻는 등의 예방이 중요합니다. 그러나 토끼가 그 병에 걸려있지 않으면 사람에게도 감염되지 않습니다.</p>",
                    BoardEnum.MEDICAL, PetTypeEnum.RABBIT, false));

            likyRepository.save(newLiky(adminBoard1, jjanggu.getEmail(), boardRepository));
            likyRepository.save(newLiky(adminBoard1, yuli.getEmail(), boardRepository));
            likyRepository.save(newLiky(adminBoard1, cheolsu.getEmail(), boardRepository));
            likyRepository.save(newLiky(adminBoard1, maenggu.getEmail(), boardRepository));

            likyRepository.save(newLiky(jjangguBoard1, yuli.getEmail(), boardRepository));
            likyRepository.save(newLiky(jjangguBoard1, cheolsu.getEmail(), boardRepository));
            likyRepository.save(newLiky(jjangguBoard1, "test100L@naver.com", boardRepository));
            likyRepository.save(newLiky(jjangguBoard1, "test101L@naver.com", boardRepository));
            likyRepository.save(newLiky(yuliBoard, jjanggu.getEmail(), boardRepository));
            likyRepository.save(newLiky(yuliBoard, cheolsu.getEmail(), boardRepository));

            commentRepository.save(newComment(jjangguBoard1, "강아지를 처음 키우시는 분들은 초반에 공부를 좀 하셔야합니다. 강아지도 하나의 인격체이기 때문에 절대로 화를 내거나 겁을주는 행동, 폭력을 쓰면 안됩니다. 만약 잘못된 행동을 한다면 목소리 톤을 낮게 한번 혼내주시면 됩니다. 배변 훈련이나 각종 개인기를 훈련할때는 잘했을때만 칭찬과 간식으로 보상을 주시면됩니다. 절대 그게 아니야, 아니, 아니야라는 질책은 오히려 헷갈리게 하는 요인이기때문에 칭찬에 의한 보상으로 훈련하시기 바랍니다.", yuli.getEmail(), boardRepository));
            commentRepository.save(newComment(jjangguBoard1, "안녕하세요! 어떤이쁜강아지를 입양하게될지 궁금하네요! 저도 처음키운강아지가 벌써 4살이되었어요! 제 경험을 토대로 설명해드릴게요!! 강아지를 입양하는 종에 대해서 공부를 해두는게 좋습니다. 종에 따라 자주발생하는병명에 주의할점도 꼭 찾아보세요! 그리고 먹으면 위험한 주의 할 음식들도 꼭 찾아서 습득하세요! 강아지는 생각보다 먹으면 안되는 음식이 많습니다. 동물보호법상에 관련된 자료도 찾아보세요!! 예를들어 동물등록을 하지않을경우 과태료를 물게됩니다. 필수사항이에요! 처음 분양받고 1~2주일정도 새로운환경 적응할수있게 인내하시고 기다려주셔야해요 그리고 예방접종에 대해서도 날짜에 간격에 맞춰서 달력에 체크해두시면 수월해집니다! 훈련관련영상은 인터넷에 쉽게 접근할수있어서 보고 따라하셔도 어렵지않으실꺼에요! 강아지는 하루가 다르게 금방금방큽니다!! 꼭 사진과 영상을 추억으로 많이기록해두세요!! 적으면 후회하게됩니다.... 강아지가 울거나 말썽피워서 키우기 힘들어도 꼭 포기하지마시고 잘키우셔요!! 훈련을 잘받은강아지는 성견에 가까울수록 성격도 달라지고 많이 차분해집니다!! 강아지를 입양받는날이 설레일텐데 좋은인연만나길 기원합니다!", cheolsu.getEmail(), boardRepository));

            commentRepository.save(newComment(yuliBoard, "좋은 정보 감사합니다!!", maenggu.getEmail(), boardRepository));
        */};
    }
}
