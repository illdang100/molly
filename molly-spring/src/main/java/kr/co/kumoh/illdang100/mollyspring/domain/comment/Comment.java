package kr.co.kumoh.illdang100.mollyspring.domain.comment;

import kr.co.kumoh.illdang100.mollyspring.domain.BaseTimeEntity;
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
public class Comment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private Board board;

    @Column(nullable = false)
    private Long accountId;

    @Column(nullable = false, length = 20)
    private String writerNickname;

    @Embedded
    private ImageFile writerProfileImage;

    @Builder
    public Comment(Long id, Board board, Long accountId, String writerNickname, ImageFile writerProfileImage) {
        this.id = id;
        this.board = board;
        this.accountId = accountId;
        this.writerNickname = writerNickname;
        this.writerProfileImage = writerProfileImage;
    }
}
