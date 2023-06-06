package kr.co.kumoh.illdang100.mollyspring.domain.image;

import kr.co.kumoh.illdang100.mollyspring.domain.account.Account;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AccountImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_image_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    @Embedded
    @Column(nullable = false)
    private ImageFile accountProfileImage;

    public void changeProfileImage(ImageFile imageFile) {
            this.accountProfileImage = imageFile;
    }
}
