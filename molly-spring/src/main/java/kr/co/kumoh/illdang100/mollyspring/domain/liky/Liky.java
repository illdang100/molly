package kr.co.kumoh.illdang100.mollyspring.domain.liky;

import kr.co.kumoh.illdang100.mollyspring.domain.board.Board;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Liky {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "liky_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private Board board;

    @Column(nullable = false)
    private Long accountId;

    @Builder
    public Liky(Long id, Board board, Long accountId) {
        this.id = id;
        this.board = board;
        this.accountId = accountId;
    }
}
