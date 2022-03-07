export enum Sign {
  O = 'O',
  X = 'X',
  notPlayed = ' ',
}

export interface Coordinate {
  x: number;
  y: number;
}

export class Game {
  private _lastSymbol: Sign = Sign.notPlayed;
  private _board: Board = new Board();

  public Play(symbol: Sign, coordinate: Coordinate): void {
    if (this.isFirstMove() && this.isPlayerX(symbol)) {
      throw new Error('Invalid first player');
    }
    if (symbol == this._lastSymbol) {
      throw new Error('Invalid next player');
    }
    this._board.MarkTile({ Symbol: symbol, Coordinate: coordinate });
    this._lastSymbol = symbol;
  }

  private isPlayerX = (symbol: Sign) => symbol == Sign.O;

  private isFirstMove = () => this._lastSymbol == Sign.notPlayed;

  public Winner(): Sign {
    const boardState = this._board.getBoardState();
    if (boardState.Status !== 'Complete') {
      return Sign.notPlayed;
    }
    return boardState.CurrentState;
  }
}

interface Tile {
  Coordinate: Coordinate;
  Symbol: Sign;
}

interface BoardState {
  Status: 'Complete' | 'InPlay';
  CurrentState: Sign;
}

class Board {
  private _plays: Tile[] = [];

  constructor() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const tile: Tile = {
          Coordinate: { x: i, y: j },
          Symbol: Sign.notPlayed,
        };
        this._plays.push(tile);
      }
    }
  }

  public getBoardState(): BoardState {
    for (let i = 0; i < 3; i++) {
      if (this.isFirstRowComplete(i) && this.isMiddleRowComplete(i)) {
        return {
          Status: 'Complete',
          CurrentState: this.SymbolAt({ x: i, y: 0 })!,
        };
      }
    }
    return { Status: 'InPlay', CurrentState: Sign.notPlayed };
  }
  private isFirstRowComplete(tileX: number): boolean {
    return (
      this.SymbolAt({ x: tileX, y: 0 })! != Sign.notPlayed &&
      this.SymbolAt({ x: tileX, y: 1 })! != Sign.notPlayed &&
      this.SymbolAt({ x: tileX, y: 2 })! != Sign.notPlayed
    );
  }

  private isBoardPositionPlayed = (coordinate: Coordinate): boolean =>
    this.SymbolAt(coordinate) != Sign.notPlayed;

  private SymbolAt(coordinate: Coordinate): Sign {
    return this._plays.find(
      (t: Tile) =>
        t.Coordinate.x == coordinate.x && t.Coordinate.y == coordinate.y
    )!.Symbol;
  }

  public MarkTile(tile: Tile): void {
    if (this.isBoardPositionPlayed(tile.Coordinate)) {
      throw new Error('Invalid position');
    }
    this._plays.find(
      (t: Tile) =>
        t.Coordinate.x == tile.Coordinate.x &&
        t.Coordinate.y == tile.Coordinate.y
    )!.Symbol = tile.Symbol;
  }

  private isMiddleRowComplete(tileX: number): boolean {
    return (
      this.SymbolAt({ x: tileX, y: 0 })! ==
        this.SymbolAt({ x: tileX, y: 1 })! &&
      this.SymbolAt({ x: tileX, y: 2 })! == this.SymbolAt({ x: tileX, y: 1 })!
    );
  }
}
//test2
//test3
