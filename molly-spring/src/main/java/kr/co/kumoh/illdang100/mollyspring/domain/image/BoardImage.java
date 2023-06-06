package kr.co.kumoh.illdang100.mollyspring.domain.image;

import kr.co.kumoh.illdang100.mollyspring.domain.board.Board;
import kr.co.kumoh.illdang100.mollyspring.domain.image.ImageFile;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BoardImage{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_image_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private Board board;

    @Embedded
    @Column(nullable = false)
    private ImageFile accountProfileImage;

    @Builder
    public BoardImage(Long id, Board board, ImageFile accountProfileImage) {
        this.id = id;
        this.board = board;
        this.accountProfileImage = accountProfileImage;
    }
}
