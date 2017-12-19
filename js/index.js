$(function () {
  document.forms.register.noValidate = true; // HTML5 doğrulamasını devre dışı bırakın - bunun yerine JavaScript'i kullanın

  $( ".form-control" ).focus(function() {
    $(this).parent().find('.required').addClass('active'); // Text tıkladıgında yukarı çıkar
  });

  $( ".form-control" ).blur(function() {
    if( $(this).val() == '' ){
      $(this).parent().find('.required').removeClass('active');
    }

  });

  $('.select2').select2({
    placeholder: "Seçiniz",
    minimumResultsForSearch: -1
  });

  $('form').on('submit', function (e) {      // Formu gönder
    var elements = this.elements;            // Form denetimlerini topla
    var valid = {};                          // Özel geçerli nesne
    var isValid;                             // Form kontrollerini kontrol et
    var isFormValid;                         // Formun tamamını kontrol et

    var i;
    for (i = 0, l = elements.length; i < l; i++) {
      // Sonraki satır, validateRequired () işlevini çağırır validateTypes ()
      isValid = validateRequired(elements[i]) && validateTypes(elements[i]);
      if (!isValid) {                    // Eğer bu iki testi geçemezse
        showErrorMessage(elements[i]);   // Hata mesajlarını göster
      } else {
        removeErrorMessage(elements[i]); // Hata mesajlarını kaldır
      }
      valid[elements[i].id] = isValid;   // Geçerli nesneye öğe ekle
    }

    // şifre (burada şifre girdisini değişken olarak önbelleğe alabilirsin)
    if (!validatePassword()) {          // validatePassword çağır ve geçerli değilse
      valid.password = false;           // Geçerli nesneyi güncelle bu öğe geçersiz
    } else {                            // Aksi takdirde hata mesajını kaldır
      removeErrorMessage(document.getElementById('password'));
    }

    for (var field in valid) {          // Geçerli nesnenin özelliklerini kontrol et
      if (!valid[field]) {              // Geçerli değilse
        isFormValid = false;            // IsFormValid değişkenini false olarak ayarlayın
        break;                          // For döngüsünü durdurun, bir hata bulundu
      }
      isFormValid = true;               // Form geçerlidir ve gönderilmesi OK
    }


    // Form geçerli değilse, gönderilmesini engelleyin
    if (!isFormValid) {
      e.preventDefault();
    }
  });

  function validateRequired(el) {
    if (isRequired(el)) {
      var valid = !isEmpty(el);                     // Değeri boş değilse (doğru / yanlış)?
      if (!valid) {                                 // Geçerli değişken yanlışsa
        setErrorMessage(el, $(el).attr('data-error')); // Hata mesajını ayarla
      }
      return valid;
    }
    return true;
  }

  function isRequired(el) {
   return ((typeof el.required === 'boolean') && el.required) ||
     (typeof el.required === 'string');
  }


  function isEmpty(el) {
    return !el.value || el.value === el.placeholder;
  }

  function validateTypes(el) {
    if (!el.value) return true;                     // Öğenin değeri yoksa, true değerini döndür

    var type = $(el).data('type') || el.getAttribute('type');  // OR get the type of input
    if (typeof validateType[type] === 'function') {
      return validateType[type](el);                // Evet ise, değerin geçerliliğini kontrol et
    } else {                                        // Degilse
      return true;
    }
  }

  // Şifreniz en az 5 karekter uzunluğunda olmalıdır
  function validatePassword() {
    var password = document.getElementById('password');
    var confPassword = document.getElementById('conf-password');
    var valid = password.value.length >= 5;
    if (!valid) {
      setErrorMessage(password, 'Şifreniz en az 5 karekter uzunluğunda olmalıdır');
	  showErrorMessage(password);
      return false;
    }
    if (password.value !== confPassword.value) {
      setErrorMessage(confPassword, $(confPassword).attr('data-error'));
	  showErrorMessage(confPassword);
	  return false;
    }
    return valid;
  }

  function setErrorMessage(el, message) {
    $(el).data('errorMessage', message);
  }

  function getErrorMessage(el) {
    return $(el).data('errorMessage') || el.title;
  }

  function showErrorMessage(el) {
    var $el = $(el);
    var errorContainer = $el.siblings('.error.message');
    if (!errorContainer.length) {
       // Hata sonrası öğeden sonra eklensin
       errorContainer = $('<span class="error message"></span>').insertAfter($el);
    }
    errorContainer.text(getErrorMessage(el));             // Hata mesajı ekle
  }

  function removeErrorMessage(el) {
    var errorContainer = $(el).siblings('.error.message');
    errorContainer.remove();                               // Hata mesajını içeren öğeyi kaldırın
  }

  var validateType = {
    number: function (el) {
      var valid = /^\d+$/.test(el.value);
      if (!valid) {
        setErrorMessage(el, 'Please enter a valid number');
      }
      return valid;
    },
    date: function (el) {
      var valid = /^(\d{2}\/\d{2}\/\d{4})|(\d{4}-\d{2}-\d{2})$/.test(el.value);
      if (!valid) {
        setErrorMessage(el, 'Please enter a valid date');
      }
      return valid;
    }
  };

});


