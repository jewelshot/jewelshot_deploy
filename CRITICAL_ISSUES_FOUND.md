# 🚨 KRİTİK SORUNLAR - ACİL DÜZELTİLMELİ!

## **SORUN 1: Canvas ve MobileStudio HALA `deductCredit()` KULLANIYOR!** ❌

**Dosya:** `src/components/organisms/Canvas.tsx` (line 1712)  
**Dosya:** `src/components/organisms/MobileStudio.tsx` (line 234)

**Problem:**

- `useCreditStore.deductCredit()` fonksiyonunu kaldırdık
- Ama Canvas ve MobileStudio hala bu fonksiyonu çağırıyor!
- TypeScript hatası verecek ve çalışmayacak!

**Canvas.tsx line 1708-1722:**

```typescript
let creditDeducted = false;

try {
  // Try to deduct credit (but don't block if it fails)
  const success = await deductCredit({  // ❌ BU FONKSIYON YOK ARTIK!
    prompt: prompt || 'enhance',
    style: 'ai-edit',
  });

  if (success) {
    creditDeducted = true;
    logger.info('[Canvas] Credit deducted successfully');
  }
```

**ÇÖZÜM:** Bu client-side credit deduction kodunu KALDIRMAK!

- Artık server-side (`/api/ai/edit`) otomatik kredi düşürüyor
- Client-side'da kredi düşürmeye gerek yok

---

## **SORUN 2: `/api/credits/check` ROUTE'U INSERT YAPAMAZ!** ❌

**Dosya:** `src/app/api/credits/check/route.ts` (line 38-44)

**Problem:**

```typescript
if (error.code === 'PGRST116') {
  const insertData = [{ user_id: user.id, credits_remaining: 10 }];
  const { data: newData, error: insertError } = await supabase
    .from('user_credits')
    .insert(insertData as any)  // ❌ BAŞARISIZ OLACAK!
    .select()
    .single();
```

**Neden Başarısız:**

- RLS Policy: `"Service role can insert credits"` (sadece service_role)
- Bu route: `ANON_KEY` kullanıyor (auth.role() = 'anon')
- SONUÇ: **INSERT PERMISSION DENIED!**

**ÇÖZÜM:** INSERT yerine RPC kullan:

```typescript
if (error.code === 'PGRST116') {
  // RPC kullan - SECURITY DEFINER olduğu için INSERT yapabilir
  const { data: rpcData, error: rpcError } = await supabase.rpc('use_credit', {
    p_user_id: user.id,
    p_description: 'Initial credits',
    p_metadata: {},
  });

  // use_credit() otomatik olarak user oluşturur (line 149-154 SQL'de)
}
```

---

## **SORUN 3: REFUND ENDPOINT YANLIŞ KULLANILIYOR** ⚠️

**Dosya:** `src/components/organisms/Canvas.tsx` (line 1741)  
**Dosya:** `src/components/organisms/MobileStudio.tsx` (line 283)

**Problem:**

```typescript
await fetch('/api/credits/add', {
  // ❌ Yanlış endpoint!
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 1,
    type: 'refund',
    description: 'Refund: AI generation failed',
    // ...
  }),
});
```

**ÇÖZÜM:** Yeni `/api/credits/refund` endpoint'ini kullan:

```typescript
await fetch('/api/credits/refund', {
  // ✅ Doğru endpoint!
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    description: 'Refund: AI generation failed',
    metadata: { error, prompt },
  }),
});
```

---

## **SORUN 4: CANVAS VE MOBILESTUDIO - YANLIŞ MİMARİ!** ❌

**Problem:**
Canvas ve MobileStudio şu akışı kullanıyor:

1. Client-side `deductCredit()` çağır ❌
2. Sonra API'ye istek gönder
3. API başarısızsa refund et

**Doğru Mimari:**

1. Direkt API'ye istek gönder ✅
2. API içinde otomatik kredi check + deduct ✅
3. API başarısız olursa zaten kredi düşmez ✅

**Canvas ve MobileStudio'dan şunlar KALDIRILMALI:**

- `deductCredit()` çağrısı
- `creditDeducted` flag'i
- Refund mekanizması (API'de zaten başarısızda kredi düşmüyor)

---

## **ÖZETnitelikleri:**

| #   | Sorun                                    | Etki                        | Öncelik   |
| --- | ---------------------------------------- | --------------------------- | --------- |
| 1   | Canvas `deductCredit()` kullanıyor       | TypeScript hatası, çalışmaz | 🔴 KRİTİK |
| 2   | MobileStudio `deductCredit()` kullanıyor | TypeScript hatası, çalışmaz | 🔴 KRİTİK |
| 3   | `/api/credits/check` INSERT yapamaz      | Yeni user'lar kredi alamaz  | 🔴 KRİTİK |
| 4   | Refund endpoint yanlış                   | Çalışır ama ideal değil     | ⚠️ ORTA   |

**HEMEN DÜZELTİLMELİ!**
