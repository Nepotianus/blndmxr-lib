export declare type Scalar = bigint;
export declare const Scalar: {
    fromBytes(buf: Uint8Array): Scalar | Error;
    fromHex(hex: string): Scalar | Error;
    toBytes(n: Scalar): Uint8Array;
    toHex(n: Scalar): string;
};
export interface Point {
    readonly x: bigint;
    readonly y: bigint;
}
export declare const Point: {
    fromPrivKey(privkey: Scalar): Point;
    fromBytes(buf: Uint8Array): Point | Error;
    fromX(x: bigint, isOdd: boolean): Error | Point;
    fromHex(hex: string): Point | Error;
    toHex(point: Point): string;
    toBytes(point: Point): Uint8Array;
};
export declare const INFINITE_POINT: Point;
export declare function scalarAdd(a: Scalar, b: Scalar): Scalar;
export declare function scalarMultiply(a: Scalar, b: Scalar): Scalar;
export declare function scalarNegate(a: Scalar): Scalar;
export declare function scalarInverse(a: Scalar): Scalar;
export declare function pointEq(a: Point, b: Point): boolean;
export declare function pointAdd(...points: Point[]): Point;
export declare function pointSubtract(a: Point, b: Point): Point;
export declare function negatePoint(a: Point): {
    x: bigint;
    y: bigint;
};
export declare function pointMultiply(point: Point, scalar: bigint): Point;
export declare function naiveMultiply(point: Point, scalar: bigint): Point;
