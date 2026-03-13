import { useState, useCallback } from 'react';

const PREFIX = '+38';
const MAX_DIGITS_AFTER_PREFIX = 10; // 0XX XXX XX XX

/**
 * Hook for Ukrainian phone input with +38 prefix.
 * Returns { phoneValue, phoneProps, rawPhone }
 * - phoneValue: display value (e.g. "+380501234567")
 * - phoneProps: spread onto <input> to handle onChange, onFocus, onKeyDown
 * - rawPhone: the full phone string to send to API
 */
export function usePhoneInput(initialValue = '') {
    const [digits, setDigits] = useState(() => {
        // Extract only digits after +38 from initial value
        const clean = initialValue.replace(/\D/g, '');
        if (clean.startsWith('38')) return clean.slice(2).slice(0, MAX_DIGITS_AFTER_PREFIX);
        if (clean.startsWith('0')) return clean.slice(0, MAX_DIGITS_AFTER_PREFIX);
        return '';
    });

    const phoneValue = PREFIX + digits;

    const handleChange = useCallback((e) => {
        let val = e.target.value;

        // Ensure prefix stays
        if (!val.startsWith(PREFIX)) {
            // User tried to delete prefix — extract digits from whatever remains
            val = PREFIX + val.replace(/\D/g, '');
        }

        // Get only the part after prefix
        const afterPrefix = val.slice(PREFIX.length);
        // Keep only digits, limit length
        const cleanDigits = afterPrefix.replace(/\D/g, '').slice(0, MAX_DIGITS_AFTER_PREFIX);
        setDigits(cleanDigits);
    }, []);

    const handleKeyDown = useCallback((e) => {
        const input = e.target;
        const selStart = input.selectionStart || 0;

        // Prevent backspace/delete from touching the +38 prefix
        if (e.key === 'Backspace' && selStart <= PREFIX.length) {
            e.preventDefault();
        }
        if (e.key === 'Delete' && selStart < PREFIX.length) {
            e.preventDefault();
        }
        // Prevent arrow left past prefix
        if (e.key === 'ArrowLeft' && selStart <= PREFIX.length) {
            e.preventDefault();
        }
    }, []);

    const handleFocus = useCallback((e) => {
        // Place cursor after prefix if it's at the start
        setTimeout(() => {
            const input = e.target;
            if (input.selectionStart < PREFIX.length) {
                input.setSelectionRange(PREFIX.length, PREFIX.length);
            }
        }, 0);
    }, []);

    const handleClick = useCallback((e) => {
        const input = e.target;
        if (input.selectionStart < PREFIX.length) {
            input.setSelectionRange(PREFIX.length, PREFIX.length);
        }
    }, []);

    const phoneProps = {
        type: 'tel',
        value: phoneValue,
        onChange: handleChange,
        onKeyDown: handleKeyDown,
        onFocus: handleFocus,
        onClick: handleClick,
        placeholder: '+38 0XX XXX XX XX',
        maxLength: PREFIX.length + MAX_DIGITS_AFTER_PREFIX,
    };

    const setPhone = useCallback((val) => {
        const clean = val.replace(/\D/g, '');
        if (clean.startsWith('38')) setDigits(clean.slice(2).slice(0, MAX_DIGITS_AFTER_PREFIX));
        else if (clean.startsWith('0')) setDigits(clean.slice(0, MAX_DIGITS_AFTER_PREFIX));
        else setDigits(clean.slice(0, MAX_DIGITS_AFTER_PREFIX));
    }, []);

    const resetPhone = useCallback(() => setDigits(''), []);

    const isValid = /^0(39|50|63|66|67|68|73|89|91|92|93|94|95|96|97|98|99)\d{7}$/.test(digits);

    return { phoneValue, phoneProps, rawPhone: phoneValue, setPhone, resetPhone, digits, isValid };
}
