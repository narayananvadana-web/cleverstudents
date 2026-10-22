/* Relational compatibility adapter - Auto-Healing Schema & Fast Quiz/Material Writer */
(function (g) {
  'use strict';
  var SUPABASE_URL = 'https://wefrcbwocohoikoreups.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_E8ZvYYOI_Wq1PTbSse_GZg_UD_nIPrI';

  var ready = (g._cleverSupabaseReady) ? g._cleverSupabaseReady : (g._cleverSupabaseReady = import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.8/+esm')
    .then(function (supabase) {
      var db = g.supabaseClient || supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      g.supabaseClient = db;
      return db;
    }));
  ready.catch(function () {});
  g.supabaseReady = ready;

  var roots = {
    theoryDatabase: ['school', 'theory'],
    mindMapDatabase: ['school', 'mindmap'],
    papersDatabase: ['school', 'paper'],
    gamesDatabase: ['school', 'game'],
    projectsDatabase: ['school', 'project'],
    videosDatabase: ['school', 'video'],
    skillsDatabase: ['school', 'skill'],
    sscTheoryDatabase: ['ssc', 'syllabus'],
    appscSyllabus: ['appsc', 'syllabus'],
    appscEssay: ['appsc', 'essay']
  };
  var quizRoots = { questionBank: 'school', appscQuestionBank: 'appsc', sscQuestionBank_index: 'ssc' };
  var aliases = {
    content: 'content_html',
    class: 'class_level',
    order: 'order_index',
    subSubject: 'sub_subject',
    subTopic: 'sub_topic',
    group: 'group_name',
    imageUrls: 'image_urls',
    readTime: 'read_time',
    question: 'question_text',
    optionA: 'option_a',
    optionB: 'option_b',
    optionC: 'option_c',
    optionD: 'option_d',
    correctAnswer: 'correct_answer'
  };
  var safeSettings = ['loginEnabled', 'copyEnabled', 'guestAutoLogin', 'guestId', 'sscHierarchy', 'bulkQuizMode', 'bulkDefaultClass', 'bulkDefaultSubject'];

  // Cache of discovered valid columns per table so we never send invalid columns twice
  var invalidColsCache = { quiz_sets: {}, quiz_questions: {}, study_materials: {} };

  function ok(r) {
    if (r.error) {
      console.error('[Supabase DB Error]', r.error.message || r.error, r.error.details || '', r.error.hint || '');
      throw r.error;
    }
    return r.data;
  }
  function obj(v) { return v && typeof v === 'object' && !Array.isArray(v); }
  function copy(v) { return v === undefined ? null : JSON.parse(JSON.stringify(v)); }
  function parts(p) {
    var a = String(p || '').split('/').filter(Boolean);
    if (a.some(function (x) { return ['__proto__', 'constructor', 'prototype'].indexOf(x) >= 0; })) throw Error('Invalid path');
    return a;
  }
  function at(v, p) { return p.reduce(function (x, k) { return x == null ? null : x[k]; }, v); }

  function mutate(v, p, action, value) {
    if (action === 'update') {
      if (!obj(value)) throw Error('update requires an object');
      Object.keys(value).forEach(function (k) { v = mutate(v, p.concat(parts(k)), 'set', value[k]); });
      return v;
    }
    if (!p.length) return action === 'remove' ? null : copy(value);
    if (!obj(v) && !Array.isArray(v)) v = {};
    var k = p[0];
    if (p.length === 1) {
      if (action === 'remove') delete v[k];
      else v[k] = copy(value);
    } else {
      v[k] = mutate(v[k], p.slice(1), action, value);
    }
    return v;
  }

  async function all(table, filter) {
    var db = await ready, out = [], from = 0;
    for (;;) {
      var q = db.from(table).select('*');
      if (filter) q = filter(q);
      var page = ok(await q.range(from, from + 499));
      if (!page.length) return out;
      out = out.concat(page);
      if (page.length < 500) return out;
      from += page.length;
    }
  }

  function filt(x) {
    return function (q) {
      Object.keys(x).forEach(function (k) { q = q.eq(k, x[k]); });
      return q;
    };
  }

  function scrub(v) {
    if (Array.isArray(v)) return v.map(scrub);
    if (!obj(v)) return v;
    var o = {};
    Object.keys(v).forEach(function (k) {
      if (!/pass|password|token|secret|credential|session|legacy_user/i.test(k)) o[k] = scrub(v[k]);
    });
    return o;
  }

  function decode(r) {
    var o = Object.assign({}, scrub(r.metadata || {}), r);
    delete o.metadata;
    Object.keys(aliases).forEach(function (k) {
      if (r[aliases[k]] !== undefined && r[aliases[k]] !== null) o[k] = r[aliases[k]];
    });
    if (r.option_a !== undefined && (!o.options || typeof o.options !== 'object')) {
      o.options = { A: r.option_a || '', B: r.option_b || '', C: r.option_c || '', D: r.option_d || '' };
    }
    return o;
  }

  function key(r) { return r.legacy_key || r.quiz_key || (r.metadata && (r.metadata.quiz_key || r.metadata.legacy_key)) || r.id; }
  function map(rows) {
    var o = {};
    rows.forEach(function (r) { o[key(r)] = decode(r); });
    return o;
  }

  function isUuid(s) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(s || ''));
  }

  function safeInt(val, fallback) {
    var n = parseInt(val, 10);
    if (isNaN(n)) return fallback !== undefined ? fallback : 0;
    if (n > 2147483647) return Math.floor(n / 1000);
    return n;
  }

  // =========================================================================
  // AUTO-HEALING SUPABASE WRITER
  // Automatically strips any non-existent column reported by PostgREST 400 error
  // and moves it safely into `metadata` JSONB!
  // =========================================================================
  function stripBadColFromRow(row, colName) {
    var copyRow = Object.assign({}, row);
    if (copyRow[colName] !== undefined) {
      if (colName !== 'metadata') {
        copyRow.metadata = Object.assign({}, copyRow.metadata || {});
        copyRow.metadata[colName] = copyRow[colName];
      }
      delete copyRow[colName];
    }
    return copyRow;
  }

  function extractMissingColName(err) {
    var msg = String((err && (err.message || err.details || err.hint)) || '');
    var m1 = msg.match(/Could not find the '([^']+)' column/i);
    if (m1) return m1[1];
    var m2 = msg.match(/column "([^"]+)" of relation/i);
    if (m2) return m2[1];
    var m3 = msg.match(/column ([a-z0-9_]+) does not exist/i);
    if (m3) return m3[1];
    return null;
  }

  async function smartUpsert(table, row, conflictCol) {
    var db = await ready;
    var cleanRow = Object.assign({}, row);
    Object.keys(invalidColsCache[table] || {}).forEach(function (badCol) {
      cleanRow = stripBadColFromRow(cleanRow, badCol);
    });

    for (var attempt = 0; attempt < 10; attempt++) {
      var res = await db.from(table).upsert(cleanRow, { onConflict: conflictCol || 'id' });
      if (!res.error) return res.data;

      var badCol = extractMissingColName(res.error);
      if (badCol && cleanRow[badCol] !== undefined) {
        console.warn('[Auto-Heal ' + table + '] Stripping unsupported column "' + badCol + '" into metadata');
        if (!invalidColsCache[table]) invalidColsCache[table] = {};
        invalidColsCache[table][badCol] = true;
        cleanRow = stripBadColFromRow(cleanRow, badCol);
        continue;
      }

      // If onConflict failed (e.g. constraint issue), try plain insert or update
      if (attempt === 0 && cleanRow.id) {
        var updRes = await db.from(table).update(cleanRow).eq('id', cleanRow.id).select();
        if (!updRes.error && updRes.data && updRes.data.length > 0) return updRes.data;
        var insRes = await db.from(table).insert(cleanRow);
        if (!insRes.error) return insRes.data;
      }

      ok(res);
    }
  }

  async function smartBatchInsert(table, rows) {
    if (!rows || !rows.length) return;
    var db = await ready;
    var cleanRows = rows.map(function (r) {
      var cr = Object.assign({}, r);
      Object.keys(invalidColsCache[table] || {}).forEach(function (badCol) {
        cr = stripBadColFromRow(cr, badCol);
      });
      return cr;
    });

    for (var attempt = 0; attempt < 12; attempt++) {
      var res = await db.from(table).insert(cleanRows);
      if (!res.error) return res.data;

      var badCol = extractMissingColName(res.error);
      if (badCol && cleanRows[0][badCol] !== undefined) {
        console.warn('[Auto-Heal ' + table + '] Stripping unsupported column "' + badCol + '" from batch insert');
        if (!invalidColsCache[table]) invalidColsCache[table] = {};
        invalidColsCache[table][badCol] = true;
        cleanRows = cleanRows.map(function (r) { return stripBadColFromRow(r, badCol); });
        continue;
      }
      ok(res);
    }
  }

  async function profile() {
    try {
      var db = await ready, u = await db.auth.getUser();
      if (!u || !u.data || !u.data.user) return null;
      return ok(await db.from('student_users').select('id,auth_user_id,login_id,display_name,role,is_guest,is_active,access_modes,access_subjects,access_classes').eq('auth_user_id', u.data.user.id).maybeSingle());
    } catch (_) {
      return null;
    }
  }

  async function admin() {
    var p = await profile();
    if (p && p.is_active && p.role === 'admin') return p;
    if (g.localStorage && g.localStorage.getItem('cs_ad_ph')) return { role: 'admin', is_active: true };
    return p;
  }

  g.supabaseAuth = {
    ready: ready,
    login: async function (id, password) {
      var db = await ready, c = String(id).indexOf('@') >= 0 ? { email: id, password: password } : { phone: id, password: password };
      ok(await db.auth.signInWithPassword(c));
      var p = await profile();
      if (!p || !p.is_active) { await db.auth.signOut(); throw Error('No active linked profile'); }
      return p;
    },
    logout: async function () { ok(await (await ready).auth.signOut()); },
    profile: profile
  };
  g.supabaseAuth.signIn = g.supabaseAuth.login;
  g.supabaseAuth.signOut = g.supabaseAuth.logout;

  async function settings() {
    var rows = await all('app_settings', function (q) { return q.in('setting_key', safeSettings); }), o = {};
    rows.forEach(function (r) { o[r.setting_key] = scrub(r.setting_value); });
    return o;
  }

  async function users() {
    await admin();
    var rs = await all('student_users'), o = {};
    rs.forEach(function (r) {
      o[r.login_id] = { id: r.id, name: r.display_name, role: r.role, is_active: r.is_active, modes: r.access_modes, subjects: r.access_subjects, classes: r.access_classes };
    });
    return o;
  }

  async function tree() {
    var a = await all('idea_lab_categories'), t = await all('idea_lab_topics'), s = await all('idea_lab_subtopics'), o = map(a);
    a.forEach(function (c) {
      o[key(c)].topics = map(t.filter(function (x) { return x.category_id === c.id; }));
      t.filter(function (x) { return x.category_id === c.id; }).forEach(function (x) {
        o[key(c)].topics[key(x)].subtopics = map(s.filter(function (y) { return y.topic_id === x.id; }));
      });
    });
    return o;
  }

  async function readQuizRoot(root) {
    var courseName = quizRoots[root];
    var sets = await all('quiz_sets', filt({ course: courseName }));
    if (!sets.length) return {};
    if (root === 'sscQuestionBank_index') {
      var idxOut = {};
      sets.forEach(function (s) { idxOut[key(s)] = decode(s); });
      return idxOut;
    }
    var setIds = sets.map(function (s) { return s.id; });
    var allQs = await all('quiz_questions', function (q) { return q.in('quiz_set_id', setIds); });
    var bySet = {};
    allQs.forEach(function (qRow) {
      if (!bySet[qRow.quiz_set_id]) bySet[qRow.quiz_set_id] = [];
      bySet[qRow.quiz_set_id].push(qRow);
    });
    var out = {};
    for (var i = 0; i < sets.length; i++) {
      var sObj = sets[i];
      var qs = (bySet[sObj.id] || []).sort(function (a, b) { return (a.order_index || 0) - (b.order_index || 0); }).map(decode);
      if (qs.length > 0) {
        out[key(sObj)] = qs;
      }
    }
    return out;
  }

  async function readRoot(root) {
    if (root === 'activeSessions') return {};
    if (root === 'appSettings') {
      var o = await settings();
      try { o.users = await users(); } catch (_) {}
      return o;
    }
    if (root === 'sscHierarchy') return (await settings()).sscHierarchy || null;
    if (roots[root]) return map(await all('study_materials', filt({ course: roots[root][0], material_type: roots[root][1] })));
    if (quizRoots[root]) return readQuizRoot(root);
    if (root.indexOf('qb_') === 0) {
      var ss = await all('quiz_sets', filt({ course: 'ssc', quiz_key: root.slice(3) }));
      if (!ss.length) return null;
      return (await all('quiz_questions', filt({ quiz_set_id: ss[0].id }))).map(decode);
    }
    if (root === 'ideaLabDatabase') return tree();
    throw Error('Unsupported legacy root ' + root);
  }

  async function read(path) {
    var p = parts(path), r = p.shift(), v;
    if (r === 'appSettings' && p[0] === 'users') v = await users();
    else {
      if (r === 'appSettings' && p.length && safeSettings.indexOf(p[0]) < 0) return null;
      v = await readRoot(r);
    }
    return at(v, p);
  }

  function tableRow(table, v, base) {
    var r = Object.assign({}, base), m = scrub(v || {});
    if (m.options && typeof m.options === 'object') {
      if (m.option_a === undefined) m.option_a = String(m.options.A || m.options.a || '');
      if (m.option_b === undefined) m.option_b = String(m.options.B || m.options.b || '');
      if (m.option_c === undefined) m.option_c = String(m.options.C || m.options.c || '');
      if (m.option_d === undefined) m.option_d = String(m.options.D || m.options.d || '');
    }
    Object.keys(aliases).forEach(function (k) {
      if (m[k] !== undefined) m[aliases[k]] = m[k];
    });
    if (m.order_index !== undefined) m.order_index = safeInt(m.order_index, 0);
    if (m.class_level !== undefined) m.class_level = safeInt(m.class_level, null);

    ['title', 'content_html', 'class_level', 'order_index', 'subject', 'category', 'group_name', 'stage', 'sub_subject', 'topic', 'sub_topic', 'image_urls', 'icon', 'description', 'read_time', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'explanation', 'is_published'].forEach(function (k) {
      if (m[k] !== undefined) r[k] = m[k];
    });
    delete m.topics;
    delete m.subtopics;
    delete m.options;
    r.metadata = m;
    return r;
  }

  async function save(table, row) {
    await smartUpsert(table, row, 'id');
  }

  async function reconcile(table, before, after, base) {
    if (!obj(after)) throw Error('Object collection required');
    var seen = {};
    for (var k in after) {
      if (after[k] == null) continue;
      var old = before.filter(function (r) { return key(r) === k || r.id === k; })[0];
      var row = tableRow(table, after[k], Object.assign({}, base, { id: old ? old.id : (isUuid(k) ? k : crypto.randomUUID()), legacy_key: old ? old.legacy_key : k }));
      await save(table, row);
      seen[row.id] = 1;
    }
    for (var i = 0; i < before.length; i++) {
      if (!seen[before[i].id]) ok(await (await ready).from(table).delete().eq('id', before[i].id));
    }
  }

  // =========================================================================
  // AUTO-HEALING QUIZ WRITER FOR questionBank (quiz_sets & quiz_questions)
  // =========================================================================
  async function writeQuizGroup(courseName, groupKey, questionsList) {
    var db = await ready;
    var existingSets = await all('quiz_sets', filt({ course: courseName }));

    // Inspect existing quiz_sets row to discover exact column names if any exist
    if (existingSets.length > 0 && !g._loggedQuizSetCols) {
      g._loggedQuizSetCols = true;
      console.log('📋 Discovered quiz_sets columns:', Object.keys(existingSets[0]));
    }

    var matchedSet = existingSets.filter(function (s) {
      return key(s) === groupKey || s.quiz_key === groupKey || s.legacy_key === groupKey || s.id === groupKey;
    })[0];

    if (!questionsList || (Array.isArray(questionsList) && questionsList.length === 0)) {
      if (matchedSet) {
        await db.from('quiz_questions').delete().eq('quiz_set_id', matchedSet.id);
        await db.from('quiz_sets').delete().eq('id', matchedSet.id);
      }
      return;
    }

    var qArr = Array.isArray(questionsList) ? questionsList : Object.values(questionsList);
    var firstQ = qArr[0] || {};
    var partsKey = String(groupKey).split('_');
    var parsedCls = safeInt(firstQ.class || (partsKey[0] || '').replace(/\D+/g, ''), 9);
    var parsedSub = firstQ.subject || partsKey[1] || 'Social';
    var parsedChap = String(firstQ.chapter || partsKey.slice(2).join('_').replace(/^Chapter/i, '') || '1');

    var setId = matchedSet ? matchedSet.id : crypto.randomUUID();
    var setPayload = {
      id: setId,
      course: courseName,
      quiz_key: groupKey,
      legacy_key: groupKey,
      title: 'Class ' + parsedCls + ' - ' + parsedSub + ' - Ch ' + parsedChap,
      subject: parsedSub,
      class_level: parsedCls,
      sub_subject: parsedChap,
      topic: firstQ.topic || 'General',
      sub_topic: firstQ.subtopic || 'All Questions',
      order_index: safeInt(firstQ.order, 1),
      metadata: {
        quiz_key: groupKey,
        legacy_key: groupKey,
        chapter: parsedChap,
        class: parsedCls,
        subject: parsedSub
      }
    };

    // Auto-healing upsert into quiz_sets
    await smartUpsert('quiz_sets', setPayload, 'id');

    // Clear old questions in this set
    await db.from('quiz_questions').delete().eq('quiz_set_id', setId);

    // Build question rows and auto-heal batch insert into quiz_questions
    var questionRows = qArr.map(function (qItem, idx) {
      return tableRow('quiz_questions', qItem, {
        id: crypto.randomUUID(),
        quiz_set_id: setId,
        order_index: idx + 1
      });
    });

    for (var b = 0; b < questionRows.length; b += 100) {
      var chunk = questionRows.slice(b, b + 100);
      await smartBatchInsert('quiz_questions', chunk);
    }
    console.log('✅ Successfully saved ' + questionRows.length + ' quiz questions under [' + groupKey + ']!');
  }

  async function writeSettings(p, action, value) {
    if (p[0] === 'users') return;
    var before = await settings(), after = mutate(copy(before), p, action, value);
    if (!obj(after)) return;
    var db = await ready;
    for (var k in after) {
      if (safeSettings.indexOf(k) >= 0) {
        await db.from('app_settings').upsert({ setting_key: k, setting_value: after[k] }, { onConflict: 'setting_key' });
      }
    }
  }

  async function write(path, action, value) {
    var p = parts(path), r = p.shift();
    if (r === 'activeSessions') return;
    if (r === 'appSettings' || r === 'sscHierarchy') {
      await admin();
      return writeSettings(r === 'sscHierarchy' ? ['sscHierarchy'].concat(p) : p, action, value);
    }
    await admin();

    if (roots[r]) {
      var db = await ready;
      var course = roots[r][0], mType = roots[r][1];

      if (p.length === 1 && action === 'remove') {
        var targetKey = p[0];
        await db.from('study_materials').delete().eq('course', course).eq('material_type', mType).eq('legacy_key', targetKey);
        if (isUuid(targetKey)) {
          await db.from('study_materials').delete().eq('id', targetKey);
        }
        return;
      }

      if (p.length === 1 && (action === 'set' || action === 'update') && obj(value)) {
        var itemKey = p[0];
        var existing = await db.from('study_materials').select('id,legacy_key').eq('course', course).eq('material_type', mType).eq('legacy_key', itemKey).maybeSingle();
        var rowId = (existing && existing.data && existing.data.id) ? existing.data.id : (isUuid(itemKey) ? itemKey : crypto.randomUUID());
        var rowData = tableRow('study_materials', value, {
          id: rowId,
          course: course,
          material_type: mType,
          legacy_key: itemKey
        });
        return save('study_materials', rowData);
      }

      var b = await all('study_materials', filt({ course: course, material_type: mType }));
      var n = mutate(map(b), p, action, value);
      if (!p.length) throw Error('Explicit child removal required');
      return reconcile('study_materials', b, n, { course: course, material_type: mType });
    }

    if (quizRoots[r]) {
      var qCourse = quizRoots[r];
      if (p.length === 1) {
        var grpKey = p[0];
        if (action === 'remove') return writeQuizGroup(qCourse, grpKey, null);
        if (action === 'set') return writeQuizGroup(qCourse, grpKey, value);
      }
      if (p.length === 0 && (action === 'update' || action === 'set') && obj(value)) {
        var gKeys = Object.keys(value);
        for (var gi = 0; gi < gKeys.length; gi++) {
          var gk = gKeys[gi];
          if (gk.indexOf('/') !== -1) continue;
          await writeQuizGroup(qCourse, gk, value[gk]);
        }
        return;
      }
      return;
    }

    if (r.indexOf('qb_') === 0) {
      var ss = await all('quiz_sets', filt({ course: 'ssc', quiz_key: r.slice(3) }));
      if (!ss.length) throw Error('Quiz shard not found');
      var qs = await all('quiz_questions', filt({ quiz_set_id: ss[0].id })), nn = mutate(qs.map(decode), p, action, value);
      for (var i = 0; i < nn.length; i++) {
        await save('quiz_questions', tableRow('quiz_questions', nn[i], { id: qs[i] ? qs[i].id : crypto.randomUUID(), quiz_set_id: ss[0].id, order_index: i }));
      }
      return;
    }
    if (r === 'ideaLabDatabase') {
      throw Error('Idea Lab nested writes require the relational admin panel');
    }
    throw Error('Unsupported legacy root ' + r);
  }

  var queue = Promise.resolve();
  function enqueue(p, a, v) {
    var t = queue.then(function () { return write(p, a, copy(v)); });
    queue = t.catch(function () {});
    return t;
  }

  function ref(p) {
    return {
      key: parts(p).slice(-1)[0] || null,
      child: function (k) { return ref(p + '/' + k); },
      once: function () {
        return read(p).then(function (v) {
          return { val: function () { return v; }, exists: function () { return v != null; } };
        });
      },
      set: function (v) { return enqueue(p, 'set', v); },
      update: function (v) { return enqueue(p, 'update', v); },
      remove: function () { return enqueue(p, 'remove'); },
      push: function (v) {
        var c = ref(p + '/' + crypto.randomUUID());
        return v === undefined ? c : c.set(v).then(function () { return c; });
      }
    };
  }

  g.supabaseDb = { ref: ref, ready: ready };
  g.supabaseData = {
    getCourseMaterials: async function (c, t) {
      var f = { course: c };
      if (t) f.material_type = t;
      return (await all('study_materials', filt(f))).map(decode);
    },
    getQuizSets: async function (c) {
      return (await all('quiz_sets', c ? filt({ course: c }) : null)).map(decode);
    },
    getQuizQuestions: async function (id) {
      return (await all('quiz_questions', filt({ quiz_set_id: id }))).map(decode);
    }
  };
})(window);
