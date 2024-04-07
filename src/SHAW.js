/**
 * A JavaScript implementation of the SHA family of hashes - defined in FIPS PUB 180-4, FIPS PUB 202,
 * and SP 800-185 - as well as the corresponding HMAC implementation as defined in FIPS PUB 198-1.
 *
 * Copyright 2008-2022 Brian Turek, 1998-2009 Paul Johnston & Contributors
 * Distributed under the BSD License
 * See http://caligatio.github.com/jsSHA/ for more information
 *
 * Two ECMAScript polyfill functions carry the following license:
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED,
 * INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
 * MERCHANTABLITY OR NON-INFRINGEMENT.
 *
 * See the Apache Version 2.0 License for specific language governing permissions and limitations under the License.
 */
!function(n, r) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = r() : "function" == typeof define && define.amd ? define(r) : (n = "undefined" != typeof globalThis ? globalThis : n || self).jsSHA = r()
}(this, (function() {
    "use strict";
    var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
      , r = "ARRAYBUFFER not supported by this environment"
      , t = "UINT8ARRAY not supported by this environment";
    function e(n, r, t, e) {
        var i, o, u, f = r || [0], w = (t = t || 0) >>> 3, s = -1 === e ? 3 : 0;
        for (i = 0; i < n.length; i += 1)
            o = (u = i + w) >>> 2,
            f.length <= o && f.push(0),
            f[o] |= n[i] << 8 * (s + e * (u % 4));
        return {
            value: f,
            binLen: 8 * n.length + t
        }
    }
    function i(i, o, u) {
        switch (o) {
        case "UTF8":
        case "UTF16BE":
        case "UTF16LE":
            break;
        default:
            throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE")
        }
        switch (i) {
        case "HEX":
            return function(n, r, t) {
                return function(n, r, t, e) {
                    var i, o, u, f;
                    if (0 != n.length % 2)
                        throw new Error("String of HEX type must be in byte increments");
                    var w = r || [0]
                      , s = (t = t || 0) >>> 3
                      , a = -1 === e ? 3 : 0;
                    for (i = 0; i < n.length; i += 2) {
                        if (o = parseInt(n.substr(i, 2), 16),
                        isNaN(o))
                            throw new Error("String of HEX type contains invalid characters");
                        for (u = (f = (i >>> 1) + s) >>> 2; w.length <= u; )
                            w.push(0);
                        w[u] |= o << 8 * (a + e * (f % 4))
                    }
                    return {
                        value: w,
                        binLen: 4 * n.length + t
                    }
                }(n, r, t, u)
            }
            ;
        case "TEXT":
            return function(n, r, t) {
                return function(n, r, t, e, i) {
                    var o, u, f, w, s, a, h, c, v = 0, A = t || [0], l = (e = e || 0) >>> 3;
                    if ("UTF8" === r)
                        for (h = -1 === i ? 3 : 0,
                        f = 0; f < n.length; f += 1)
                            for (u = [],
                            128 > (o = n.charCodeAt(f)) ? u.push(o) : 2048 > o ? (u.push(192 | o >>> 6),
                            u.push(128 | 63 & o)) : 55296 > o || 57344 <= o ? u.push(224 | o >>> 12, 128 | o >>> 6 & 63, 128 | 63 & o) : (f += 1,
                            o = 65536 + ((1023 & o) << 10 | 1023 & n.charCodeAt(f)),
                            u.push(240 | o >>> 18, 128 | o >>> 12 & 63, 128 | o >>> 6 & 63, 128 | 63 & o)),
                            w = 0; w < u.length; w += 1) {
                                for (s = (a = v + l) >>> 2; A.length <= s; )
                                    A.push(0);
                                A[s] |= u[w] << 8 * (h + i * (a % 4)),
                                v += 1
                            }
                    else
                        for (h = -1 === i ? 2 : 0,
                        c = "UTF16LE" === r && 1 !== i || "UTF16LE" !== r && 1 === i,
                        f = 0; f < n.length; f += 1) {
                            for (o = n.charCodeAt(f),
                            !0 === c && (o = (w = 255 & o) << 8 | o >>> 8),
                            s = (a = v + l) >>> 2; A.length <= s; )
                                A.push(0);
                            A[s] |= o << 8 * (h + i * (a % 4)),
                            v += 2
                        }
                    return {
                        value: A,
                        binLen: 8 * v + e
                    }
                }(n, o, r, t, u)
            }
            ;
        case "B64":
            return function(r, t, e) {
                return function(r, t, e, i) {
                    var o, u, f, w, s, a, h = 0, c = t || [0], v = (e = e || 0) >>> 3, A = -1 === i ? 3 : 0, l = r.indexOf("=");
                    if (-1 === r.search(/^[a-zA-Z0-9=+/]+$/))
                        throw new Error("Invalid character in base-64 string");
                    if (r = r.replace(/=/g, ""),
                    -1 !== l && l < r.length)
                        throw new Error("Invalid '=' found in base-64 string");
                    for (o = 0; o < r.length; o += 4) {
                        for (w = r.substr(o, 4),
                        f = 0,
                        u = 0; u < w.length; u += 1)
                            f |= n.indexOf(w.charAt(u)) << 18 - 6 * u;
                        for (u = 0; u < w.length - 1; u += 1) {
                            for (s = (a = h + v) >>> 2; c.length <= s; )
                                c.push(0);
                            c[s] |= (f >>> 16 - 8 * u & 255) << 8 * (A + i * (a % 4)),
                            h += 1
                        }
                    }
                    return {
                        value: c,
                        binLen: 8 * h + e
                    }
                }(r, t, e, u)
            }
            ;
        case "BYTES":
            return function(n, r, t) {
                return function(n, r, t, e) {
                    var i, o, u, f, w = r || [0], s = (t = t || 0) >>> 3, a = -1 === e ? 3 : 0;
                    for (o = 0; o < n.length; o += 1)
                        i = n.charCodeAt(o),
                        u = (f = o + s) >>> 2,
                        w.length <= u && w.push(0),
                        w[u] |= i << 8 * (a + e * (f % 4));
                    return {
                        value: w,
                        binLen: 8 * n.length + t
                    }
                }(n, r, t, u)
            }
            ;
        case "ARRAYBUFFER":
            try {
                new ArrayBuffer(0)
            } catch (n) {
                throw new Error(r)
            }
            return function(n, r, t) {
                return function(n, r, t, i) {
                    return e(new Uint8Array(n), r, t, i)
                }(n, r, t, u)
            }
            ;
        case "UINT8ARRAY":
            try {
                new Uint8Array(0)
            } catch (n) {
                throw new Error(t)
            }
            return function(n, r, t) {
                return e(n, r, t, u)
            }
            ;
        default:
            throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY")
        }
    }
    function o(e, i, o, u) {
        switch (e) {
        case "HEX":
            return function(n) {
                return function(n, r, t, e) {
                    var i, o, u = "0123456789abcdef", f = "", w = r / 8, s = -1 === t ? 3 : 0;
                    for (i = 0; i < w; i += 1)
                        o = n[i >>> 2] >>> 8 * (s + t * (i % 4)),
                        f += u.charAt(o >>> 4 & 15) + u.charAt(15 & o);
                    return e.outputUpper ? f.toUpperCase() : f
                }(n, i, o, u)
            }
            ;
        case "B64":
            return function(r) {
                return function(r, t, e, i) {
                    var o, u, f, w, s, a = "", h = t / 8, c = -1 === e ? 3 : 0;
                    for (o = 0; o < h; o += 3)
                        for (w = o + 1 < h ? r[o + 1 >>> 2] : 0,
                        s = o + 2 < h ? r[o + 2 >>> 2] : 0,
                        f = (r[o >>> 2] >>> 8 * (c + e * (o % 4)) & 255) << 16 | (w >>> 8 * (c + e * ((o + 1) % 4)) & 255) << 8 | s >>> 8 * (c + e * ((o + 2) % 4)) & 255,
                        u = 0; u < 4; u += 1)
                            a += 8 * o + 6 * u <= t ? n.charAt(f >>> 6 * (3 - u) & 63) : i.b64Pad;
                    return a
                }(r, i, o, u)
            }
            ;
        case "BYTES":
            return function(n) {
                return function(n, r, t) {
                    var e, i, o = "", u = r / 8, f = -1 === t ? 3 : 0;
                    for (e = 0; e < u; e += 1)
                        i = n[e >>> 2] >>> 8 * (f + t * (e % 4)) & 255,
                        o += String.fromCharCode(i);
                    return o
                }(n, i, o)
            }
            ;
        case "ARRAYBUFFER":
            try {
                new ArrayBuffer(0)
            } catch (n) {
                throw new Error(r)
            }
            return function(n) {
                return function(n, r, t) {
                    var e, i = r / 8, o = new ArrayBuffer(i), u = new Uint8Array(o), f = -1 === t ? 3 : 0;
                    for (e = 0; e < i; e += 1)
                        u[e] = n[e >>> 2] >>> 8 * (f + t * (e % 4)) & 255;
                    return o
                }(n, i, o)
            }
            ;
        case "UINT8ARRAY":
            try {
                new Uint8Array(0)
            } catch (n) {
                throw new Error(t)
            }
            return function(n) {
                return function(n, r, t) {
                    var e, i = r / 8, o = -1 === t ? 3 : 0, u = new Uint8Array(i);
                    for (e = 0; e < i; e += 1)
                        u[e] = n[e >>> 2] >>> 8 * (o + t * (e % 4)) & 255;
                    return u
                }(n, i, o)
            }
            ;
        default:
            throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY")
        }
    }
    var u = 4294967296
      , f = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]
      , w = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428]
      , s = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]
      , a = "Chosen SHA variant is not supported"
      , h = "Cannot set numRounds with MAC";
    function c(n, r) {
        var t, e, i = n.binLen >>> 3, o = r.binLen >>> 3, u = i << 3, f = 4 - i << 3;
        if (i % 4 != 0) {
            for (t = 0; t < o; t += 4)
                e = i + t >>> 2,
                n.value[e] |= r.value[t >>> 2] << u,
                n.value.push(0),
                n.value[e + 1] |= r.value[t >>> 2] >>> f;
            return (n.value.length << 2) - 4 >= o + i && n.value.pop(),
            {
                value: n.value,
                binLen: n.binLen + r.binLen
            }
        }
        return {
            value: n.value.concat(r.value),
            binLen: n.binLen + r.binLen
        }
    }
    function v(n) {
        var r = {
            outputUpper: !1,
            b64Pad: "=",
            outputLen: -1
        }
          , t = n || {}
          , e = "Output length must be a multiple of 8";
        if (r.outputUpper = t.outputUpper || !1,
        t.b64Pad && (r.b64Pad = t.b64Pad),
        t.outputLen) {
            if (t.outputLen % 8 != 0)
                throw new Error(e);
            r.outputLen = t.outputLen
        } else if (t.shakeLen) {
            if (t.shakeLen % 8 != 0)
                throw new Error(e);
            r.outputLen = t.shakeLen
        }
        if ("boolean" != typeof r.outputUpper)
            throw new Error("Invalid outputUpper formatting option");
        if ("string" != typeof r.b64Pad)
            throw new Error("Invalid b64Pad formatting option");
        return r
    }
    function A(n, r, t, e) {
        var o = n + " must include a value and format";
        if (!r) {
            if (!e)
                throw new Error(o);
            return e
        }
        if (void 0 === r.value || !r.format)
            throw new Error(o);
        return i(r.format, r.encoding || "UTF8", t)(r.value)
    }
    var l = function() {
        function n(n, r, t) {
            var e = t || {};
            if (this.t = r,
            this.i = e.encoding || "UTF8",
            this.numRounds = e.numRounds || 1,
            isNaN(this.numRounds) || this.numRounds !== parseInt(this.numRounds, 10) || 1 > this.numRounds)
                throw new Error("numRounds must a integer >= 1");
            this.o = n,
            this.u = [],
            this.h = 0,
            this.v = !1,
            this.A = 0,
            this.l = !1,
            this.H = [],
            this.S = []
        }
        return n.prototype.update = function(n) {
            var r, t = 0, e = this.p >>> 5, i = this.m(n, this.u, this.h), o = i.binLen, u = i.value, f = o >>> 5;
            for (r = 0; r < f; r += e)
                t + this.p <= o && (this.U = this.R(u.slice(r, r + e), this.U),
                t += this.p);
            return this.A += t,
            this.u = u.slice(t >>> 5),
            this.h = o % this.p,
            this.v = !0,
            this
        }
        ,
        n.prototype.getHash = function(n, r) {
            var t, e, i = this.T, u = v(r);
            if (this.C) {
                if (-1 === u.outputLen)
                    throw new Error("Output length must be specified in options");
                i = u.outputLen
            }
            var f = o(n, i, this.F, u);
            if (this.l && this.K)
                return f(this.K(u));
            for (e = this.g(this.u.slice(), this.h, this.A, this.L(this.U), i),
            t = 1; t < this.numRounds; t += 1)
                this.C && i % 32 != 0 && (e[e.length - 1] &= 16777215 >>> 24 - i % 32),
                e = this.g(e, i, 0, this.B(this.o), i);
            return f(e)
        }
        ,
        n.prototype.setHMACKey = function(n, r, t) {
            if (!this.k)
                throw new Error("Variant does not support HMAC");
            if (this.v)
                throw new Error("Cannot set MAC key after calling update");
            var e = i(r, (t || {}).encoding || "UTF8", this.F);
            this.Y(e(n))
        }
        ,
        n.prototype.Y = function(n) {
            var r, t = this.p >>> 3, e = t / 4 - 1;
            if (1 !== this.numRounds)
                throw new Error(h);
            if (this.l)
                throw new Error("MAC key already set");
            for (t < n.binLen / 8 && (n.value = this.g(n.value, n.binLen, 0, this.B(this.o), this.T)); n.value.length <= e; )
                n.value.push(0);
            for (r = 0; r <= e; r += 1)
                this.H[r] = 909522486 ^ n.value[r],
                this.S[r] = 1549556828 ^ n.value[r];
            this.U = this.R(this.H, this.U),
            this.A = this.p,
            this.l = !0
        }
        ,
        n.prototype.getHMAC = function(n, r) {
            var t = v(r);
            return o(n, this.T, this.F, t)(this.N())
        }
        ,
        n.prototype.N = function() {
            var n;
            if (!this.l)
                throw new Error("Cannot call getHMAC without first setting MAC key");
            var r = this.g(this.u.slice(), this.h, this.A, this.L(this.U), this.T);
            return n = this.R(this.S, this.B(this.o)),
            n = this.g(r, this.T, this.p, n, this.T)
        }
        ,
        n
    }()
      , E = function(n, r) {
        return E = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(n, r) {
            n.__proto__ = r
        }
        || function(n, r) {
            for (var t in r)
                Object.prototype.hasOwnProperty.call(r, t) && (n[t] = r[t])
        }
        ,
        E(n, r)
    };
    function b(n, r) {
        if ("function" != typeof r && null !== r)
            throw new TypeError("Class extends value " + String(r) + " is not a constructor or null");
        function t() {
            this.constructor = n
        }
        E(n, r),
        n.prototype = null === r ? Object.create(r) : (t.prototype = r.prototype,
        new t)
    }
    function H(n, r) {
        return n << r | n >>> 32 - r
    }
    function S(n, r) {
        return n >>> r | n << 32 - r
    }
    function d(n, r) {
        return n >>> r
    }
    function p(n, r, t) {
        return n ^ r ^ t
    }
    function y(n, r, t) {
        return n & r ^ ~n & t
    }
    function m(n, r, t) {
        return n & r ^ n & t ^ r & t
    }
    function U(n) {
        return S(n, 2) ^ S(n, 13) ^ S(n, 22)
    }
    function R(n, r) {
        var t = (65535 & n) + (65535 & r);
        return (65535 & (n >>> 16) + (r >>> 16) + (t >>> 16)) << 16 | 65535 & t
    }
    function T(n, r, t, e) {
        var i = (65535 & n) + (65535 & r) + (65535 & t) + (65535 & e);
        return (65535 & (n >>> 16) + (r >>> 16) + (t >>> 16) + (e >>> 16) + (i >>> 16)) << 16 | 65535 & i
    }
    function C(n, r, t, e, i) {
        var o = (65535 & n) + (65535 & r) + (65535 & t) + (65535 & e) + (65535 & i);
        return (65535 & (n >>> 16) + (r >>> 16) + (t >>> 16) + (e >>> 16) + (i >>> 16) + (o >>> 16)) << 16 | 65535 & o
    }
    function F(n) {
        return S(n, 7) ^ S(n, 18) ^ d(n, 3)
    }
    function K(n) {
        return S(n, 6) ^ S(n, 11) ^ S(n, 25)
    }
    function g(n) {
        return [1732584193, 4023233417, 2562383102, 271733878, 3285377520]
    }
    function L(n, r) {
        var t, e, i, o, u, f, w, s = [];
        for (t = r[0],
        e = r[1],
        i = r[2],
        o = r[3],
        u = r[4],
        w = 0; w < 80; w += 1)
            s[w] = w < 16 ? n[w] : H(s[w - 3] ^ s[w - 8] ^ s[w - 14] ^ s[w - 16], 1),
            f = w < 20 ? C(H(t, 5), y(e, i, o), u, 1518500249, s[w]) : w < 40 ? C(H(t, 5), p(e, i, o), u, 1859775393, s[w]) : w < 60 ? C(H(t, 5), m(e, i, o), u, 2400959708, s[w]) : C(H(t, 5), p(e, i, o), u, 3395469782, s[w]),
            u = o,
            o = i,
            i = H(e, 30),
            e = t,
            t = f;
        return r[0] = R(t, r[0]),
        r[1] = R(e, r[1]),
        r[2] = R(i, r[2]),
        r[3] = R(o, r[3]),
        r[4] = R(u, r[4]),
        r
    }
    function B(n, r, t, e) {
        for (var i, o = 15 + (r + 65 >>> 9 << 4), f = r + t; n.length <= o; )
            n.push(0);
        for (n[r >>> 5] |= 128 << 24 - r % 32,
        n[o] = 4294967295 & f,
        n[o - 1] = f / u | 0,
        i = 0; i < n.length; i += 16)
            e = L(n.slice(i, i + 16), e);
        return e
    }
    var k = function(n) {
        function r(r, t, e) {
            var o = this;
            if ("SHA-1" !== r)
                throw new Error(a);
            var u = e || {};
            return (o = n.call(this, r, t, e) || this).k = !0,
            o.K = o.N,
            o.F = -1,
            o.m = i(o.t, o.i, o.F),
            o.R = L,
            o.L = function(n) {
                return n.slice()
            }
            ,
            o.B = g,
            o.g = B,
            o.U = [1732584193, 4023233417, 2562383102, 271733878, 3285377520],
            o.p = 512,
            o.T = 160,
            o.C = !1,
            u.hmacKey && o.Y(A("hmacKey", u.hmacKey, o.F)),
            o
        }
        return b(r, n),
        r
    }(l);
    function Y(n) {
        return "SHA-224" == n ? w.slice() : s.slice()
    }
    function N(n, r) {
        var t, e, i, o, u, w, s, a, h, c, v, A, l = [];
        for (t = r[0],
        e = r[1],
        i = r[2],
        o = r[3],
        u = r[4],
        w = r[5],
        s = r[6],
        a = r[7],
        v = 0; v < 64; v += 1)
            l[v] = v < 16 ? n[v] : T(S(A = l[v - 2], 17) ^ S(A, 19) ^ d(A, 10), l[v - 7], F(l[v - 15]), l[v - 16]),
            h = C(a, K(u), y(u, w, s), f[v], l[v]),
            c = R(U(t), m(t, e, i)),
            a = s,
            s = w,
            w = u,
            u = R(o, h),
            o = i,
            i = e,
            e = t,
            t = R(h, c);
        return r[0] = R(t, r[0]),
        r[1] = R(e, r[1]),
        r[2] = R(i, r[2]),
        r[3] = R(o, r[3]),
        r[4] = R(u, r[4]),
        r[5] = R(w, r[5]),
        r[6] = R(s, r[6]),
        r[7] = R(a, r[7]),
        r
    }
    var I = function(n) {
        function r(r, t, e) {
            var o = this;
            if ("SHA-224" !== r && "SHA-256" !== r)
                throw new Error(a);
            var f = e || {};
            return (o = n.call(this, r, t, e) || this).K = o.N,
            o.k = !0,
            o.F = -1,
            o.m = i(o.t, o.i, o.F),
            o.R = N,
            o.L = function(n) {
                return n.slice()
            }
            ,
            o.B = Y,
            o.g = function(n, t, e, i) {
                return function(n, r, t, e, i) {
                    for (var o, f = 15 + (r + 65 >>> 9 << 4), w = r + t; n.length <= f; )
                        n.push(0);
                    for (n[r >>> 5] |= 128 << 24 - r % 32,
                    n[f] = 4294967295 & w,
                    n[f - 1] = w / u | 0,
                    o = 0; o < n.length; o += 16)
                        e = N(n.slice(o, o + 16), e);
                    return "SHA-224" === i ? [e[0], e[1], e[2], e[3], e[4], e[5], e[6]] : e
                }(n, t, e, i, r)
            }
            ,
            o.U = Y(r),
            o.p = 512,
            o.T = "SHA-224" === r ? 224 : 256,
            o.C = !1,
            f.hmacKey && o.Y(A("hmacKey", f.hmacKey, o.F)),
            o
        }
        return b(r, n),
        r
    }(l)
      , M = function(n, r) {
        this.I = n,
        this.M = r
    };
    function X(n, r) {
        var t;
        return r > 32 ? (t = 64 - r,
        new M(n.M << r | n.I >>> t,n.I << r | n.M >>> t)) : 0 !== r ? (t = 32 - r,
        new M(n.I << r | n.M >>> t,n.M << r | n.I >>> t)) : n
    }
    function z(n, r) {
        var t;
        return r < 32 ? (t = 32 - r,
        new M(n.I >>> r | n.M << t,n.M >>> r | n.I << t)) : (t = 64 - r,
        new M(n.M >>> r | n.I << t,n.I >>> r | n.M << t))
    }
    function O(n, r) {
        return new M(n.I >>> r,n.M >>> r | n.I << 32 - r)
    }
    function j(n, r, t) {
        return new M(n.I & r.I ^ ~n.I & t.I,n.M & r.M ^ ~n.M & t.M)
    }
    function _(n, r, t) {
        return new M(n.I & r.I ^ n.I & t.I ^ r.I & t.I,n.M & r.M ^ n.M & t.M ^ r.M & t.M)
    }
    function x(n) {
        var r = z(n, 28)
          , t = z(n, 34)
          , e = z(n, 39);
        return new M(r.I ^ t.I ^ e.I,r.M ^ t.M ^ e.M)
    }
    function P(n, r) {
        var t, e;
        t = (65535 & n.M) + (65535 & r.M);
        var i = (65535 & (e = (n.M >>> 16) + (r.M >>> 16) + (t >>> 16))) << 16 | 65535 & t;
        return t = (65535 & n.I) + (65535 & r.I) + (e >>> 16),
        e = (n.I >>> 16) + (r.I >>> 16) + (t >>> 16),
        new M((65535 & e) << 16 | 65535 & t,i)
    }
    function V(n, r, t, e) {
        var i, o;
        i = (65535 & n.M) + (65535 & r.M) + (65535 & t.M) + (65535 & e.M);
        var u = (65535 & (o = (n.M >>> 16) + (r.M >>> 16) + (t.M >>> 16) + (e.M >>> 16) + (i >>> 16))) << 16 | 65535 & i;
        return i = (65535 & n.I) + (65535 & r.I) + (65535 & t.I) + (65535 & e.I) + (o >>> 16),
        o = (n.I >>> 16) + (r.I >>> 16) + (t.I >>> 16) + (e.I >>> 16) + (i >>> 16),
        new M((65535 & o) << 16 | 65535 & i,u)
    }
    function Z(n, r, t, e, i) {
        var o, u;
        o = (65535 & n.M) + (65535 & r.M) + (65535 & t.M) + (65535 & e.M) + (65535 & i.M);
        var f = (65535 & (u = (n.M >>> 16) + (r.M >>> 16) + (t.M >>> 16) + (e.M >>> 16) + (i.M >>> 16) + (o >>> 16))) << 16 | 65535 & o;
        return o = (65535 & n.I) + (65535 & r.I) + (65535 & t.I) + (65535 & e.I) + (65535 & i.I) + (u >>> 16),
        u = (n.I >>> 16) + (r.I >>> 16) + (t.I >>> 16) + (e.I >>> 16) + (i.I >>> 16) + (o >>> 16),
        new M((65535 & u) << 16 | 65535 & o,f)
    }
    function q(n, r) {
        return new M(n.I ^ r.I,n.M ^ r.M)
    }
    function D(n) {
        var r = z(n, 1)
          , t = z(n, 8)
          , e = O(n, 7);
        return new M(r.I ^ t.I ^ e.I,r.M ^ t.M ^ e.M)
    }
    function G(n) {
        var r = z(n, 14)
          , t = z(n, 18)
          , e = z(n, 41);
        return new M(r.I ^ t.I ^ e.I,r.M ^ t.M ^ e.M)
    }
    var J = [new M(f[0],3609767458), new M(f[1],602891725), new M(f[2],3964484399), new M(f[3],2173295548), new M(f[4],4081628472), new M(f[5],3053834265), new M(f[6],2937671579), new M(f[7],3664609560), new M(f[8],2734883394), new M(f[9],1164996542), new M(f[10],1323610764), new M(f[11],3590304994), new M(f[12],4068182383), new M(f[13],991336113), new M(f[14],633803317), new M(f[15],3479774868), new M(f[16],2666613458), new M(f[17],944711139), new M(f[18],2341262773), new M(f[19],2007800933), new M(f[20],1495990901), new M(f[21],1856431235), new M(f[22],3175218132), new M(f[23],2198950837), new M(f[24],3999719339), new M(f[25],766784016), new M(f[26],2566594879), new M(f[27],3203337956), new M(f[28],1034457026), new M(f[29],2466948901), new M(f[30],3758326383), new M(f[31],168717936), new M(f[32],1188179964), new M(f[33],1546045734), new M(f[34],1522805485), new M(f[35],2643833823), new M(f[36],2343527390), new M(f[37],1014477480), new M(f[38],1206759142), new M(f[39],344077627), new M(f[40],1290863460), new M(f[41],3158454273), new M(f[42],3505952657), new M(f[43],106217008), new M(f[44],3606008344), new M(f[45],1432725776), new M(f[46],1467031594), new M(f[47],851169720), new M(f[48],3100823752), new M(f[49],1363258195), new M(f[50],3750685593), new M(f[51],3785050280), new M(f[52],3318307427), new M(f[53],3812723403), new M(f[54],2003034995), new M(f[55],3602036899), new M(f[56],1575990012), new M(f[57],1125592928), new M(f[58],2716904306), new M(f[59],442776044), new M(f[60],593698344), new M(f[61],3733110249), new M(f[62],2999351573), new M(f[63],3815920427), new M(3391569614,3928383900), new M(3515267271,566280711), new M(3940187606,3454069534), new M(4118630271,4000239992), new M(116418474,1914138554), new M(174292421,2731055270), new M(289380356,3203993006), new M(460393269,320620315), new M(685471733,587496836), new M(852142971,1086792851), new M(1017036298,365543100), new M(1126000580,2618297676), new M(1288033470,3409855158), new M(1501505948,4234509866), new M(1607167915,987167468), new M(1816402316,1246189591)];
    function Q(n) {
        return "SHA-384" === n ? [new M(3418070365,w[0]), new M(1654270250,w[1]), new M(2438529370,w[2]), new M(355462360,w[3]), new M(1731405415,w[4]), new M(41048885895,w[5]), new M(3675008525,w[6]), new M(1203062813,w[7])] : [new M(s[0],4089235720), new M(s[1],2227873595), new M(s[2],4271175723), new M(s[3],1595750129), new M(s[4],2917565137), new M(s[5],725511199), new M(s[6],4215389547), new M(s[7],327033209)]
    }
    function W(n, r) {
        var t, e, i, o, u, f, w, s, a, h, c, v, A, l, E, b, H = [];
        for (t = r[0],
        e = r[1],
        i = r[2],
        o = r[3],
        u = r[4],
        f = r[5],
        w = r[6],
        s = r[7],
        c = 0; c < 80; c += 1)
            c < 16 ? (v = 2 * c,
            H[c] = new M(n[v],n[v + 1])) : H[c] = V((A = H[c - 2],
            l = void 0,
            E = void 0,
            b = void 0,
            l = z(A, 19),
            E = z(A, 61),
            b = O(A, 6),
            new M(l.I ^ E.I ^ b.I,l.M ^ E.M ^ b.M)), H[c - 7], D(H[c - 15]), H[c - 16]),
            a = Z(s, G(u), j(u, f, w), J[c], H[c]),
            h = P(x(t), _(t, e, i)),
            s = w,
            w = f,
            f = u,
            u = P(o, a),
            o = i,
            i = e,
            e = t,
            t = P(a, h);
        return r[0] = P(t, r[0]),
        r[1] = P(e, r[1]),
        r[2] = P(i, r[2]),
        r[3] = P(o, r[3]),
        r[4] = P(u, r[4]),
        r[5] = P(f, r[5]),
        r[6] = P(w, r[6]),
        r[7] = P(s, r[7]),
        r
    }
    var $ = function(n) {
        function r(r, t, e) {
            var o = this;
            if ("SHA-384" !== r && "SHA-512" !== r)
                throw new Error(a);
            var f = e || {};
            return (o = n.call(this, r, t, e) || this).K = o.N,
            o.k = !0,
            o.F = -1,
            o.m = i(o.t, o.i, o.F),
            o.R = W,
            o.L = function(n) {
                return n.slice()
            }
            ,
            o.B = Q,
            o.g = function(n, t, e, i) {
                return function(n, r, t, e, i) {
                    for (var o, f = 31 + (r + 129 >>> 10 << 5), w = r + t; n.length <= f; )
                        n.push(0);
                    for (n[r >>> 5] |= 128 << 24 - r % 32,
                    n[f] = 4294967295 & w,
                    n[f - 1] = w / u | 0,
                    o = 0; o < n.length; o += 32)
                        e = W(n.slice(o, o + 32), e);
                    return "SHA-384" === i ? [e[0].I, e[0].M, e[1].I, e[1].M, e[2].I, e[2].M, e[3].I, e[3].M, e[4].I, e[4].M, e[5].I, e[5].M] : [e[0].I, e[0].M, e[1].I, e[1].M, e[2].I, e[2].M, e[3].I, e[3].M, e[4].I, e[4].M, e[5].I, e[5].M, e[6].I, e[6].M, e[7].I, e[7].M]
                }(n, t, e, i, r)
            }
            ,
            o.U = Q(r),
            o.p = 1024,
            o.T = "SHA-384" === r ? 384 : 512,
            o.C = !1,
            f.hmacKey && o.Y(A("hmacKey", f.hmacKey, o.F)),
            o
        }
        return b(r, n),
        r
    }(l)
      , nn = [new M(0,1), new M(0,32898), new M(2147483648,32906), new M(2147483648,2147516416), new M(0,32907), new M(0,2147483649), new M(2147483648,2147516545), new M(2147483648,32777), new M(0,138), new M(0,136), new M(0,2147516425), new M(0,2147483658), new M(0,2147516555), new M(2147483648,139), new M(2147483648,32905), new M(2147483648,32771), new M(2147483648,32770), new M(2147483648,128), new M(0,32778), new M(2147483648,2147483658), new M(2147483648,2147516545), new M(2147483648,32896), new M(0,2147483649), new M(2147483648,2147516424)]
      , rn = [[0, 36, 3, 41, 18], [1, 44, 10, 45, 2], [62, 6, 43, 15, 61], [28, 55, 25, 21, 56], [27, 20, 39, 8, 14]];
    function tn(n) {
        var r, t = [];
        for (r = 0; r < 5; r += 1)
            t[r] = [new M(0,0), new M(0,0), new M(0,0), new M(0,0), new M(0,0)];
        return t
    }
    function en(n) {
        var r, t = [];
        for (r = 0; r < 5; r += 1)
            t[r] = n[r].slice();
        return t
    }
    function on(n, r) {
        var t, e, i, o, u, f, w, s, a, h = [], c = [];
        if (null !== n)
            for (e = 0; e < n.length; e += 2)
                r[(e >>> 1) % 5][(e >>> 1) / 5 | 0] = q(r[(e >>> 1) % 5][(e >>> 1) / 5 | 0], new M(n[e + 1],n[e]));
        for (t = 0; t < 24; t += 1) {
            for (o = tn(),
            e = 0; e < 5; e += 1)
                h[e] = (u = r[e][0],
                f = r[e][1],
                w = r[e][2],
                s = r[e][3],
                a = r[e][4],
                new M(u.I ^ f.I ^ w.I ^ s.I ^ a.I,u.M ^ f.M ^ w.M ^ s.M ^ a.M));
            for (e = 0; e < 5; e += 1)
                c[e] = q(h[(e + 4) % 5], X(h[(e + 1) % 5], 1));
            for (e = 0; e < 5; e += 1)
                for (i = 0; i < 5; i += 1)
                    r[e][i] = q(r[e][i], c[e]);
            for (e = 0; e < 5; e += 1)
                for (i = 0; i < 5; i += 1)
                    o[i][(2 * e + 3 * i) % 5] = X(r[e][i], rn[e][i]);
            for (e = 0; e < 5; e += 1)
                for (i = 0; i < 5; i += 1)
                    r[e][i] = q(o[e][i], new M(~o[(e + 1) % 5][i].I & o[(e + 2) % 5][i].I,~o[(e + 1) % 5][i].M & o[(e + 2) % 5][i].M));
            r[0][0] = q(r[0][0], nn[t])
        }
        return r
    }
    function un(n) {
        var r, t, e = 0, i = [0, 0], o = [4294967295 & n, n / u & 2097151];
        for (r = 6; r >= 0; r--)
            0 === (t = o[r >> 2] >>> 8 * r & 255) && 0 === e || (i[e + 1 >> 2] |= t << 8 * (e + 1),
            e += 1);
        return e = 0 !== e ? e : 1,
        i[0] |= e,
        {
            value: e + 1 > 4 ? i : [i[0]],
            binLen: 8 + 8 * e
        }
    }
    function fn(n) {
        return c(un(n.binLen), n)
    }
    function wn(n, r) {
        var t, e = un(r), i = r >>> 2, o = (i - (e = c(e, n)).value.length % i) % i;
        for (t = 0; t < o; t++)
            e.value.push(0);
        return e.value
    }
    var sn = function(n) {
        function r(r, t, e) {
            var o = this
              , u = 6
              , f = 0
              , w = e || {};
            if (1 !== (o = n.call(this, r, t, e) || this).numRounds) {
                if (w.kmacKey || w.hmacKey)
                    throw new Error(h);
                if ("CSHAKE128" === o.o || "CSHAKE256" === o.o)
                    throw new Error("Cannot set numRounds for CSHAKE variants")
            }
            switch (o.F = 1,
            o.m = i(o.t, o.i, o.F),
            o.R = on,
            o.L = en,
            o.B = tn,
            o.U = tn(),
            o.C = !1,
            r) {
            case "SHA3-224":
                o.p = f = 1152,
                o.T = 224,
                o.k = !0,
                o.K = o.N;
                break;
            case "SHA3-256":
                o.p = f = 1088,
                o.T = 256,
                o.k = !0,
                o.K = o.N;
                break;
            case "SHA3-384":
                o.p = f = 832,
                o.T = 384,
                o.k = !0,
                o.K = o.N;
                break;
            case "SHA3-512":
                o.p = f = 576,
                o.T = 512,
                o.k = !0,
                o.K = o.N;
                break;
            case "SHAKE128":
                u = 31,
                o.p = f = 1344,
                o.T = -1,
                o.C = !0,
                o.k = !1,
                o.K = null;
                break;
            case "SHAKE256":
                u = 31,
                o.p = f = 1088,
                o.T = -1,
                o.C = !0,
                o.k = !1,
                o.K = null;
                break;
            case "KMAC128":
                u = 4,
                o.p = f = 1344,
                o.X(e),
                o.T = -1,
                o.C = !0,
                o.k = !1,
                o.K = o.O;
                break;
            case "KMAC256":
                u = 4,
                o.p = f = 1088,
                o.X(e),
                o.T = -1,
                o.C = !0,
                o.k = !1,
                o.K = o.O;
                break;
            case "CSHAKE128":
                o.p = f = 1344,
                u = o.j(e),
                o.T = -1,
                o.C = !0,
                o.k = !1,
                o.K = null;
                break;
            case "CSHAKE256":
                o.p = f = 1088,
                u = o.j(e),
                o.T = -1,
                o.C = !0,
                o.k = !1,
                o.K = null;
                break;
            default:
                throw new Error(a)
            }
            return o.g = function(n, r, t, e, i) {
                return function(n, r, t, e, i, o, u) {
                    var f, w, s = 0, a = [], h = i >>> 5, c = r >>> 5;
                    for (f = 0; f < c && r >= i; f += h)
                        e = on(n.slice(f, f + h), e),
                        r -= i;
                    for (n = n.slice(f),
                    r %= i; n.length < h; )
                        n.push(0);
                    for (n[(f = r >>> 3) >> 2] ^= o << f % 4 * 8,
                    n[h - 1] ^= 2147483648,
                    e = on(n, e); 32 * a.length < u && (w = e[s % 5][s / 5 | 0],
                    a.push(w.M),
                    !(32 * a.length >= u)); )
                        a.push(w.I),
                        0 == 64 * (s += 1) % i && (on(null, e),
                        s = 0);
                    return a
                }(n, r, 0, e, f, u, i)
            }
            ,
            w.hmacKey && o.Y(A("hmacKey", w.hmacKey, o.F)),
            o
        }
        return b(r, n),
        r.prototype.j = function(n, r) {
            var t = function(n) {
                var r = n || {};
                return {
                    funcName: A("funcName", r.funcName, 1, {
                        value: [],
                        binLen: 0
                    }),
                    customization: A("Customization", r.customization, 1, {
                        value: [],
                        binLen: 0
                    })
                }
            }(n || {});
            r && (t.funcName = r);
            var e = c(fn(t.funcName), fn(t.customization));
            if (0 !== t.customization.binLen || 0 !== t.funcName.binLen) {
                for (var i = wn(e, this.p >>> 3), o = 0; o < i.length; o += this.p >>> 5)
                    this.U = this.R(i.slice(o, o + (this.p >>> 5)), this.U),
                    this.A += this.p;
                return 4
            }
            return 31
        }
        ,
        r.prototype.X = function(n) {
            var r = function(n) {
                var r = n || {};
                return {
                    kmacKey: A("kmacKey", r.kmacKey, 1),
                    funcName: {
                        value: [1128353099],
                        binLen: 32
                    },
                    customization: A("Customization", r.customization, 1, {
                        value: [],
                        binLen: 0
                    })
                }
            }(n || {});
            this.j(n, r.funcName);
            for (var t = wn(fn(r.kmacKey), this.p >>> 3), e = 0; e < t.length; e += this.p >>> 5)
                this.U = this.R(t.slice(e, e + (this.p >>> 5)), this.U),
                this.A += this.p;
            this.l = !0
        }
        ,
        r.prototype.O = function(n) {
            var r = c({
                value: this.u.slice(),
                binLen: this.h
            }, function(n) {
                var r, t, e = 0, i = [0, 0], o = [4294967295 & n, n / u & 2097151];
                for (r = 6; r >= 0; r--)
                    0 == (t = o[r >> 2] >>> 8 * r & 255) && 0 === e || (i[e >> 2] |= t << 8 * e,
                    e += 1);
                return i[(e = 0 !== e ? e : 1) >> 2] |= e << 8 * e,
                {
                    value: e + 1 > 4 ? i : [i[0]],
                    binLen: 8 + 8 * e
                }
            }(n.outputLen));
            return this.g(r.value, r.binLen, this.A, this.L(this.U), n.outputLen)
        }
        ,
        r
    }(l);
    return function() {
        function n(n, r, t) {
            if ("SHA-1" == n)
                this._ = new k(n,r,t);
            else if ("SHA-224" == n || "SHA-256" == n)
                this._ = new I(n,r,t);
            else if ("SHA-384" == n || "SHA-512" == n)
                this._ = new $(n,r,t);
            else {
                if ("SHA3-224" != n && "SHA3-256" != n && "SHA3-384" != n && "SHA3-512" != n && "SHAKE128" != n && "SHAKE256" != n && "CSHAKE128" != n && "CSHAKE256" != n && "KMAC128" != n && "KMAC256" != n)
                    throw new Error(a);
                this._ = new sn(n,r,t)
            }
        }
        return n.prototype.update = function(n) {
            return this._.update(n),
            this
        }
        ,
        n.prototype.getHash = function(n, r) {
            return this._.getHash(n, r)
        }
        ,
        n.prototype.setHMACKey = function(n, r, t) {
            this._.setHMACKey(n, r, t)
        }
        ,
        n.prototype.getHMAC = function(n, r) {
            return this._.getHMAC(n, r)
        }
        ,
        n
    }()
}
));
//# sourceMappingURL=sha.js.map
