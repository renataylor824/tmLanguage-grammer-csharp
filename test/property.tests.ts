/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Property", () => {
    before(() => { should(); });

    describe("Property", () => {
        it("declaration", async () => {
            const input = Input.InClass(`
public IBooom Property
{
    get { return null; }
    set { something = value; }
}`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Type("IBooom"),
                Token.Identifiers.PropertyName("Property"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Literals.Null,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace,
                Token.Keywords.Set,
                Token.Punctuation.OpenBrace,
                Token.Variables.ReadWrite("something"),
                Token.Operators.Assignment,
                Token.Variables.ReadWrite("value"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("declaration single line", async () => {
            const input = Input.InClass(`public IBooom Property { get { return null; } private set { something = value; } }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Type("IBooom"),
                Token.Identifiers.PropertyName("Property"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Literals.Null,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace,
                Token.Keywords.Modifiers.Private,
                Token.Keywords.Set,
                Token.Punctuation.OpenBrace,
                Token.Variables.ReadWrite("something"),
                Token.Operators.Assignment,
                Token.Variables.ReadWrite("value"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("declaration without modifiers", async () => {
            const input = Input.InClass(`IBooom Property {get; set;}`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Type("IBooom"),
                Token.Identifiers.PropertyName("Property"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Keywords.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("auto-property single line", async function () {
            const input = Input.InClass(`public IBooom Property { get; set; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Type("IBooom"),
                Token.Identifiers.PropertyName("Property"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Keywords.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("auto-property single line (protected internal)", async function () {
            const input = Input.InClass(`protected internal IBooom Property { get; set; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Protected,
                Token.Keywords.Modifiers.Internal,
                Token.Type("IBooom"),
                Token.Identifiers.PropertyName("Property"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Keywords.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("auto-property", async () => {
            const input = Input.InClass(`
public IBooom Property
{
    get;
    set;
}`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Type("IBooom"),
                Token.Identifiers.PropertyName("Property"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Keywords.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("init auto-property", async () => {
            const input = Input.InClass(`public int X { get; init; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.PrimitiveType.Int,
                Token.Identifiers.PropertyName("X"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Keywords.Init,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("generic auto-property", async () => {
            const input = Input.InClass(`public Dictionary<string, List<T>[]> Property { get; set; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Type("Dictionary"),
                Token.Punctuation.TypeParameters.Begin,
                Token.PrimitiveType.String,
                Token.Punctuation.Comma,
                Token.Type("List"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Type("T"),
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Punctuation.TypeParameters.End,
                Token.Identifiers.PropertyName("Property"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Keywords.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("auto-property initializer", async () => {
            const input = Input.InClass(`public Dictionary<string, List<T>[]> Property { get; } = new Dictionary<string, List<T>[]>();`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Type("Dictionary"),
                Token.Punctuation.TypeParameters.Begin,
                Token.PrimitiveType.String,
                Token.Punctuation.Comma,
                Token.Type("List"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Type("T"),
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Punctuation.TypeParameters.End,
                Token.Identifiers.PropertyName("Property"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace,
                Token.Operators.Assignment,
                Token.Keywords.New,
                Token.Type("Dictionary"),
                Token.Punctuation.TypeParameters.Begin,
                Token.PrimitiveType.String,
                Token.Punctuation.Comma,
                Token.Type("List"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Type("T"),
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("expression body", async () => {
            const input = Input.InClass(`
private string prop1 => "hello";
private bool   prop2 => true;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Private,
                Token.PrimitiveType.String,
                Token.Identifiers.PropertyName("prop1"),
                Token.Operators.Arrow,
                Token.Punctuation.String.Begin,
                Token.Literals.String("hello"),
                Token.Punctuation.String.End,
                Token.Punctuation.Semicolon,

                Token.Keywords.Modifiers.Private,
                Token.PrimitiveType.Bool,
                Token.Identifiers.PropertyName("prop2"),
                Token.Operators.Arrow,
                Token.Literals.Boolean.True,
                Token.Punctuation.Semicolon]);
        });

        it("explicitly-implemented interface member", async () => {
            const input = Input.InClass(`string IFoo<string>.Bar { get; set; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Type("IFoo"),
                Token.Punctuation.TypeParameters.Begin,
                Token.PrimitiveType.String,
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.Accessor,
                Token.Identifiers.PropertyName("Bar"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Keywords.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("declaration in interface", async () => {
            const input = Input.InInterface(`string Bar { get; set; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifiers.PropertyName("Bar"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Keywords.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("declaration in interface (read-only)", async () => {
            const input = Input.InInterface(`string Bar { get; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifiers.PropertyName("Bar"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("declaration in interface (write-only)", async () => {
            const input = Input.InInterface(`string Bar { set; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifiers.PropertyName("Bar"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("declaration with attributes", async () => {
            const input = Input.InClass(`
[Obsolete]
public int P1
{
    [Obsolete]
    get { }
    [Obsolete]
    set { }
}`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenBracket,
                Token.Type("Obsolete"),
                Token.Punctuation.CloseBracket,
                Token.Keywords.Modifiers.Public,
                Token.PrimitiveType.Int,
                Token.Identifiers.PropertyName("P1"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.OpenBracket,
                Token.Type("Obsolete"),
                Token.Punctuation.CloseBracket,
                Token.Keywords.Get,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.OpenBracket,
                Token.Type("Obsolete"),
                Token.Punctuation.CloseBracket,
                Token.Keywords.Set,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("Expression-bodied property accessors (issue #44)", async () => {
            const input = Input.InClass(`
public int Timeout
{
    get => Socket.ReceiveTimeout;
    set => Socket.ReceiveTimeout = value;
}`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.PrimitiveType.Int,
                Token.Identifiers.PropertyName("Timeout"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Operators.Arrow,
                Token.Variables.Object("Socket"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("ReceiveTimeout"),
                Token.Punctuation.Semicolon,
                Token.Keywords.Set,
                Token.Operators.Arrow,
                Token.Variables.Object("Socket"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("ReceiveTimeout"),
                Token.Operators.Assignment,
                Token.Variables.ReadWrite("value"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("ref return", async () => {
            const input = Input.InInterface(`ref int P { get; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Ref,
                Token.PrimitiveType.Int,
                Token.Identifiers.PropertyName("P"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("ref readonly return", async () => {
            const input = Input.InInterface(`ref readonly int P { get; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Ref,
                Token.Keywords.Modifiers.ReadOnly,
                Token.PrimitiveType.Int,
                Token.Identifiers.PropertyName("P"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("expression body ref return", async () => {
            const input = Input.InClass(`ref int P => ref x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Ref,
                Token.PrimitiveType.Int,
                Token.Identifiers.PropertyName("P"),
                Token.Operators.Arrow,
                Token.Keywords.Modifiers.Ref,
                Token.Variables.ReadWrite("x"),
                Token.Punctuation.Semicolon]);
        });

        it("expression body ref readonly return", async () => {
            const input = Input.InClass(`ref readonly int P => ref x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Ref,
                Token.Keywords.Modifiers.ReadOnly,
                Token.PrimitiveType.Int,
                Token.Identifiers.PropertyName("P"),
                Token.Operators.Arrow,
                Token.Keywords.Modifiers.Ref,
                Token.Variables.ReadWrite("x"),
                Token.Punctuation.Semicolon]);
        });

        it("required property", async () => {
            const input = Input.InClass(`required int P { get; set; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Required,
                Token.PrimitiveType.Int,
                Token.Identifiers.PropertyName("P"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Keywords.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });
    });
});
