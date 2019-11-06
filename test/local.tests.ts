/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Grammar", () => {
    before(() => { should(); });

    describe("Locals", () => {
        it("declaration", async () => {
            const input = Input.InMethod(`int x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("x"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("declaration with initializer", async () => {
            const input = Input.InMethod(`int x = 42;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("x"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("42"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("multiple declarators", async () => {
            const input = Input.InMethod(`int x, y;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("x"),
                Token.Punctuation.Comma,
                Token.Identifiers.LocalName("y"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("multiple declarators with initializers", async () => {
            const input = Input.InMethod(`int x = 19, y = 23;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("x"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("19"),
                Token.Punctuation.Comma,
                Token.Identifiers.LocalName("y"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("23"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("const declaration", async () => {
            const input = Input.InMethod(`const int x = 42;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Const,
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("x"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("42"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("const with multiple declarators", async () => {
            const input = Input.InMethod(`const int x = 19, y = 23;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Const,
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("x"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("19"),
                Token.Punctuation.Comma,
                Token.Identifiers.LocalName("y"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("23"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("ref local", async () => {
            const input = Input.InMethod(`ref int x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Ref,
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("x"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("ref readonly local", async () => {
            const input = Input.InMethod(`ref readonly int x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Ref,
                Token.Keywords.Modifiers.ReadOnly,
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("x"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("ref local with initializer", async () => {
            const input = Input.InMethod(`ref int x = ref y;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Ref,
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("x"),
                Token.Operators.Assignment,
                Token.Keywords.Modifiers.Ref,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("ref readonly local with initializer", async () => {
            const input = Input.InMethod(`ref readonly int x = ref y;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Ref,
                Token.Keywords.Modifiers.ReadOnly,
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("x"),
                Token.Operators.Assignment,
                Token.Keywords.Modifiers.Ref,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("ref readonly local var with initializer", async () => {
            const input = Input.InMethod(`ref readonly var x = ref y;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Ref,
                Token.Keywords.Modifiers.ReadOnly,
                Token.Keywords.Var,
                Token.Identifiers.LocalName("x"),
                Token.Operators.Assignment,
                Token.Keywords.Modifiers.Ref,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon
            ]);
        });
    });
});